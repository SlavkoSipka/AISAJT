import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const MIN_PASSWORD_LENGTH = 8;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { clientName, clientEmail, password } = body;

    if (!clientEmail || !clientName) {
      return new Response(
        JSON.stringify({ error: 'Obavezna polja: clientEmail, clientName' }),
        { status: 400 }
      );
    }

    if (typeof password !== 'string' || !password.trim()) {
      return new Response(
        JSON.stringify({ error: 'Lozinka je obavezna' }),
        { status: 400 }
      );
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Lozinka mora imati najmanje ${MIN_PASSWORD_LENGTH} karaktera` }),
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: clientEmail.trim(),
      password,
      email_confirm: true,
      user_metadata: {
        full_name: clientName.trim(),
        role: 'client',
      },
    });

    if (userError) {
      return new Response(JSON.stringify({ error: userError.message }), { status: 400 });
    }

    return new Response(
      JSON.stringify({
        success: true,
        userId: userData.user.id,
        email: clientEmail.trim(),
      }),
      { status: 201 }
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Serverska greška';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
