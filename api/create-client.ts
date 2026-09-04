import { getSupabaseAdmin } from './_lib/supabase-server.js';

const DEFAULT_STEPS = [
  { position: 1, title: 'Prikupljanje materijala', description: 'Prikupljamo sve potrebne materijale: logo, tekstove, fotografije i vaše zahteve za sajt.' },
  { position: 2, title: 'Wireframe dizajn', description: 'Kreiramo strukturu sajta — raspored elemenata po stranicama pre vizuelnog dizajna.' },
  { position: 3, title: 'Vizuelni dizajn', description: 'Dizajniramo izgled sajta prema vašem brendu — boje, fontovi, slike.' },
  { position: 4, title: 'Razvoj (kodiranje)', description: 'Razvijamo sajt — pretvaramo dizajn u funkcionalan, brz i responzivan veb sajt.' },
  { position: 5, title: 'Testiranje i korekcije', description: 'Testiramo sajt na svim uređajima i ispravljamo eventualne greške.' },
  { position: 6, title: 'Objava sajta', description: 'Objavljujemo sajt na vaš domen i podešavamo sve za produkciju.' },
];

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { clientName, clientEmail, projectName, domain, packageName, packagePrice, netlifyPreviewUrl } = body;

    if (!clientEmail || !clientName || !projectName) {
      return new Response(JSON.stringify({ error: 'Obavezna polja: clientEmail, clientName, projectName' }), { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const tempPassword = `AiSajt_${Math.random().toString(36).slice(2, 10)}!`;

    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: clientEmail,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: clientName,
        role: 'client',
      },
    });

    if (userError) {
      return new Response(JSON.stringify({ error: userError.message }), { status: 400 });
    }

    const userId = userData.user.id;

    const { error: projectError, data: projectData } = await supabase
      .from('projects')
      .insert({
        client_id: userId,
        name: projectName,
        domain: domain || null,
        netlify_preview_url: netlifyPreviewUrl || null,
        package_name: packageName || null,
        package_price: packagePrice || null,
        status: 'active',
      })
      .select()
      .single();

    if (projectError) {
      return new Response(JSON.stringify({ error: projectError.message }), { status: 500 });
    }

    const stepsToInsert = DEFAULT_STEPS.map(step => ({
      project_id: projectData.id,
      ...step,
      status: 'pending',
    }));

    await supabase.from('project_steps').insert(stepsToInsert);

    if (process.env.RESEND_API_KEY) {
      try {
        const portalUrl = process.env.VITE_PORTAL_URL || 'https://aisajt.com/portal';

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'AiSajt Portal <portal@aisajt.com>',
            to: [clientEmail],
            subject: `Dobrodošli! Vaš projekat "${projectName}" je kreiran`,
            html: `
              <h2>Dobrodošli na AiSajt portal!</h2>
              <p>Poštovani ${clientName},</p>
              <p>Vaš projekat <strong>${projectName}</strong> je kreiran i možete pratiti napredak putem portala.</p>
              <p><strong>Podaci za prijavu:</strong></p>
              <ul>
                <li>Email: ${clientEmail}</li>
                <li>Privremena lozinka: ${tempPassword}</li>
              </ul>
              <p><a href="${portalUrl}/login">Prijavite se na portal</a></p>
              <p>Preporučujemo da promenite lozinku nakon prve prijave.</p>
              <br>
              <p>Srdačno,<br>AiSajt tim</p>
            `,
          }),
        });
      } catch {
        // Email sending is non-critical
      }
    }

    return new Response(JSON.stringify({
      success: true,
      userId,
      projectId: projectData.id,
      tempPassword,
    }), { status: 201 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Serverska greška';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
