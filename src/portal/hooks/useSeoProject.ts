import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { SeoProject, SeoMetrics, SeoKeyword, SeoTask, SeoProgress, SeoAlert } from '../lib/types';

export interface SeoProjectData {
  seoProject: SeoProject | null;
  metricsHistory: SeoMetrics[];
  latestMetrics: SeoMetrics | null;
  previousMetrics: SeoMetrics | null;
  keywords: SeoKeyword[];
  tasks: SeoTask[];
  progress: SeoProgress[];
  alerts: SeoAlert[];
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useSeoProject(overrideProjectId?: string): SeoProjectData {
  const { profile } = useAuth();

  const [seoProject, setSeoProject] = useState<SeoProject | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<SeoMetrics[]>([]);
  const [keywords, setKeywords] = useState<SeoKeyword[]>([]);
  const [tasks, setTasks] = useState<SeoTask[]>([]);
  const [progress, setProgress] = useState<SeoProgress[]>([]);
  const [alerts, setAlerts] = useState<SeoAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const initialLoadDone = useRef(false);

  const fetchData = useCallback(async () => {
    if (!profile && !overrideProjectId) {
      setLoading(false);
      return;
    }
    // Only show full-page spinner on first load; subsequent refetches are silent
    if (!initialLoadDone.current) setLoading(true);

    let projectData: SeoProject | null = null;

    if (overrideProjectId) {
      const { data } = await supabase
        .from('seo_projects')
        .select('*')
        .eq('id', overrideProjectId)
        .single();
      projectData = data as SeoProject | null;
    } else if (profile) {
      const { data } = await supabase
        .from('seo_projects')
        .select('*')
        .eq('client_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      projectData = data as SeoProject | null;
    }

    if (!projectData) {
      setSeoProject(null);
      setLoading(false);
      return;
    }

    setSeoProject(projectData);

    const [
      { data: metricsData },
      { data: keywordsData },
      { data: tasksData },
      { data: progressData },
      { data: alertsData },
    ] = await Promise.all([
      supabase
        .from('seo_metrics')
        .select('*')
        .eq('seo_project_id', projectData.id)
        .order('month', { ascending: true }),
      supabase
        .from('seo_keywords')
        .select('*')
        .eq('seo_project_id', projectData.id)
        .order('current_position', { ascending: true }),
      supabase
        .from('seo_tasks')
        .select('*')
        .eq('seo_project_id', projectData.id)
        .order('position', { ascending: true }),
      supabase
        .from('seo_progress')
        .select('*')
        .eq('seo_project_id', projectData.id)
        .order('position', { ascending: true }),
      supabase
        .from('seo_alerts')
        .select('*')
        .eq('seo_project_id', projectData.id)
        .order('created_at', { ascending: false }),
    ]);

    setMetricsHistory((metricsData as SeoMetrics[]) || []);
    setKeywords((keywordsData as SeoKeyword[]) || []);
    setTasks((tasksData as SeoTask[]) || []);
    setProgress((progressData as SeoProgress[]) || []);
    setAlerts((alertsData as SeoAlert[]) || []);
    initialLoadDone.current = true;
    setLoading(false);
  }, [profile, overrideProjectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const latestMetrics = metricsHistory.length > 0 ? metricsHistory[metricsHistory.length - 1] : null;
  const previousMetrics = metricsHistory.length > 1 ? metricsHistory[metricsHistory.length - 2] : null;

  return {
    seoProject,
    metricsHistory,
    latestMetrics,
    previousMetrics,
    keywords,
    tasks,
    progress,
    alerts,
    loading,
    refetch: fetchData,
  };
}
