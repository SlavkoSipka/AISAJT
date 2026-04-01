import type { Context } from '@netlify/functions';

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), { status: 500 });
  }

  try {
    const { to, subject, html, type } = await req.json();

    if (!to || !subject) {
      return new Response(JSON.stringify({ error: 'Missing to or subject' }), { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const recipient = type === 'to_admin' && adminEmail ? adminEmail : to;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AiSajt Portal <portal@aisajt.com>',
        to: [recipient],
        subject,
        html: html || `<p>${subject}</p>`,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return new Response(JSON.stringify({ error: body }), { status: res.status });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Serverska greška';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};
