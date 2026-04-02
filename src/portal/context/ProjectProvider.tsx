import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './PortalAuthProvider';
import type { Project, ProjectStep, SeoProject } from '../lib/types';

type ProjectContextValue = {
  project: Project | null;
  seoProject: SeoProject | null;
  steps: ProjectStep[];
  loading: boolean;
  progressPercentage: number;
  activeStep: ProjectStep | undefined;
  estimatedCompletion: string | null | undefined;
  refetch: () => void;
};

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [seoProject, setSeoProject] = useState<SeoProject | null>(null);
  const [steps, setSteps] = useState<ProjectStep[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchProject = useCallback(async () => {
    if (!profile) return;

    // Only show loading spinner on initial load, not on refetch
    if (!hasFetched.current) {
      setLoading(true);
    }

    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (projects && projects.length > 0) {
      const proj = projects[0] as Project;
      setProject(proj);

      const { data: stepsData } = await supabase
        .from('project_steps')
        .select('*')
        .eq('project_id', proj.id)
        .order('position', { ascending: true });

      setSteps((stepsData as ProjectStep[]) || []);
    }

    // Also fetch SEO project
    const { data: seoProjects } = await supabase
      .from('seo_projects')
      .select('*')
      .eq('client_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (seoProjects && seoProjects.length > 0) {
      setSeoProject(seoProjects[0] as SeoProject);
    } else {
      setSeoProject(null);
    }

    hasFetched.current = true;
    setLoading(false);
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    fetchProject();
  }, [profile, fetchProject]);

  const progressPercentage = steps.length > 0
    ? (steps.filter(s => s.status === 'done').length / steps.length) * 100
    : 0;

  const activeStep = steps.find(s => s.status === 'active');

  const estimatedCompletion = steps
    .filter(s => s.estimated_date)
    .sort((a, b) => (b.estimated_date! > a.estimated_date! ? 1 : -1))[0]?.estimated_date;

  const value = useMemo(
    () => ({
      project,
      seoProject,
      steps,
      loading,
      progressPercentage,
      activeStep,
      estimatedCompletion,
      refetch: fetchProject,
    }),
    [project, seoProject, steps, loading, progressPercentage, activeStep, estimatedCompletion, fetchProject]
  );

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext(): ProjectContextValue {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error('useProject mora biti unutar <ProjectProvider>.');
  }
  return ctx;
}
