import { getSupabaseAdmin } from './supabase-server';

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError || !user?.user?.email) {
      return new Response(JSON.stringify({ error: 'Korisnik nije pronađen' }), { status: 404 });
    }

    const { error: linkError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: user.user.email,
    });

    if (linkError) {
      return new Response(JSON.stringify({ error: linkError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Serverska greška';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
