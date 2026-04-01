import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ProjectsTable } from '../components/admin/ProjectsTable';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { Loader2, PlusCircle } from 'lucide-react';
import type { ProjectWithClient, Project, Profile, ProjectStep } from '../lib/types';
import '../portal.css';

export function AdminOverview() {
  const [projects, setProjects] = useState<ProjectWithClient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);

    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!projectsData) {
      setLoading(false);
      return;
    }

    const clientIds = [...new Set((projectsData as Project[]).map(p => p.client_id))];
    const projectIds = (projectsData as Project[]).map(p => p.id);

    const [{ data: profiles }, { data: steps }, { data: unreadCounts }] = await Promise.all([
      supabase.from('profiles').select('*').in('id', clientIds),
      supabase.from('project_steps').select('*').in('project_id', projectIds).order('position'),
      supabase.from('messages').select('project_id').eq('is_read', false),
    ]);

    const profileMap = new Map((profiles as Profile[] || []).map(p => [p.id, p]));
    const stepsMap = new Map<string, ProjectStep[]>();
    (steps as ProjectStep[] || []).forEach(s => {
      if (!stepsMap.has(s.project_id)) stepsMap.set(s.project_id, []);
      stepsMap.get(s.project_id)!.push(s);
    });

    const unreadMap = new Map<string, number>();
    (unreadCounts as { project_id: string }[] || []).forEach(m => {
      unreadMap.set(m.project_id, (unreadMap.get(m.project_id) || 0) + 1);
    });

    const enriched: ProjectWithClient[] = (projectsData as Project[]).map(p => ({
      ...p,
      client: profileMap.get(p.client_id) || { id: p.client_id, full_name: 'Nepoznat', role: 'client' as const, avatar_url: null, created_at: '' },
      steps: stepsMap.get(p.id) || [],
      unread_count: unreadMap.get(p.id) || 0,
    }));

    setProjects(enriched);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="portal-root">
      <Sidebar />
      <div className="md:ml-[220px] min-h-screen pb-20 md:pb-0">
        <Topbar title="Svi projekti" />
        <main className="px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[16px] font-semibold text-[#1A1916] tracking-[-0.3px]">
              Projekti ({projects.length})
            </h2>
            <Link
              to="/portal/admin/projekti/novi"
              className="portal-btn portal-btn-primary text-[13px]"
            >
              <PlusCircle size={16} />
              Novi projekat
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 text-[#6B4FBB] animate-spin" />
            </div>
          ) : (
            <ProjectsTable projects={projects} />
          )}
        </main>
      </div>
    </div>
  );
}
