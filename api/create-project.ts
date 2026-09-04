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
    const { clientId, projectName, domain, netlifyPreviewUrl } = body;

    if (!clientId || !projectName) {
      return new Response(
        JSON.stringify({ error: 'Obavezna polja: clientId, projectName' }),
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: clientProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', clientId)
      .eq('role', 'client')
      .single();

    if (profileError || !clientProfile) {
      return new Response(JSON.stringify({ error: 'Klijent nije pronađen' }), { status: 404 });
    }

    const { error: projectError, data: projectData } = await supabase
      .from('projects')
      .insert({
        client_id: clientId,
        name: projectName,
        domain: domain || null,
        netlify_preview_url: netlifyPreviewUrl || null,
        package_name: null,
        package_price: null,
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
        const { data: authUser } = await supabase.auth.admin.getUserById(clientId);
        const clientEmail = authUser?.user?.email;
        const portalUrl = process.env.VITE_PORTAL_URL || 'https://aisajt.com/portal';

        if (clientEmail) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'AiSajt Portal <portal@aisajt.com>',
              to: [clientEmail],
              subject: `Vaš projekat "${projectName}" je kreiran`,
              html: `
                <h2>Novi projekat na AiSajt portalu</h2>
                <p>Poštovani ${clientProfile.full_name},</p>
                <p>Projekat <strong>${projectName}</strong> je upravo kreiran za vas.</p>
                <p><a href="${portalUrl}/login">Prijavite se na portal</a> i pratite napredak.</p>
                <br>
                <p>Srdačno,<br>AiSajt tim</p>
              `,
            }),
          });
        }
      } catch {
        // Email is non-critical
      }
    }

    return new Response(
      JSON.stringify({ success: true, projectId: projectData.id }),
      { status: 201 }
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Serverska greška';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
