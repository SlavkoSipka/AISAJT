import type { Context } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface NetlifyDeployPayload {
  id?: string;
  deploy_id?: string;
  url?: string;
  deploy_ssl_url?: string;
  ssl_url?: string;
  title?: string;
  commit_ref?: string;
  committed_at?: string;
  created_at?: string;
  published_at?: string;
  site_id?: string;
  name?: string;
}

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const webhookSecret = process.env.NETLIFY_WEBHOOK_SECRET;
  if (webhookSecret) {
    const headerSecret = req.headers.get('x-webhook-secret') || req.headers.get('x-netlify-webhook-secret');
    if (headerSecret !== webhookSecret) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
  }

  try {
    const payload = (await req.json()) as NetlifyDeployPayload;

    const deployUrl = payload.deploy_ssl_url || payload.ssl_url || payload.url || '';
    const deployId = payload.deploy_id || payload.id || '';
    const commitMessage = payload.title || null;
    const deployedAt = payload.published_at || payload.committed_at || payload.created_at || new Date().toISOString();

    if (!deployUrl) {
      return new Response(JSON.stringify({ error: 'No deploy URL in payload' }), { status: 400 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const normalizedUrl = deployUrl.replace(/\/$/, '').toLowerCase();

    const { data: projects } = await supabase
      .from('projects')
      .select('id, netlify_preview_url')
      .not('netlify_preview_url', 'is', null);

    if (!projects || projects.length === 0) {
      return new Response(JSON.stringify({ error: 'No projects with preview URLs found' }), { status: 404 });
    }

    const matched = projects.find(p => {
      if (!p.netlify_preview_url) return false;
      const projUrl = p.netlify_preview_url.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();
      const hookUrl = normalizedUrl.replace(/^https?:\/\//, '');
      return hookUrl === projUrl;
    });

    if (!matched) {
      return new Response(
        JSON.stringify({ error: 'No matching project for this deploy URL', deployUrl: normalizedUrl }),
        { status: 404 }
      );
    }

    const { error: insertError } = await supabase.from('project_deploys').insert({
      project_id: matched.id,
      deploy_id: deployId || null,
      deploy_url: deployUrl,
      commit_message: commitMessage,
      admin_summary: null,
      is_visible: false,
      deployed_at: deployedAt,
    });

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
    }

    return new Response(
      JSON.stringify({ success: true, projectId: matched.id }),
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};
