import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Project, ProjectStep } from '../lib/types';

export function useProject() {
  const { profile } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [steps, setSteps] = useState<ProjectStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    const fetchProject = async () => {
      setLoading(true);

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

      setLoading(false);
    };

    fetchProject();
  }, [profile]);

  const progressPercentage = steps.length > 0
    ? (steps.filter(s => s.status === 'done').length / steps.length) * 100
    : 0;

  const activeStep = steps.find(s => s.status === 'active');

  const estimatedCompletion = steps
    .filter(s => s.estimated_date)
    .sort((a, b) => (b.estimated_date! > a.estimated_date! ? 1 : -1))[0]?.estimated_date;

  return {
    project,
    steps,
    loading,
    progressPercentage,
    activeStep,
    estimatedCompletion,
  };
}
