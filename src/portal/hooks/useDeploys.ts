import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { ProjectDeploy } from '../lib/types';

export function useDeploys(projectId: string | undefined) {
  const { isAdmin } = useAuth();
  const [deploys, setDeploys] = useState<ProjectDeploy[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeploys = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);

    let query = supabase
      .from('project_deploys')
      .select('*')
      .eq('project_id', projectId)
      .order('deployed_at', { ascending: false });

    if (!isAdmin) {
      query = query.eq('is_visible', true);
    }

    const { data } = await query;
    setDeploys((data as ProjectDeploy[]) || []);
    setLoading(false);
  }, [projectId, isAdmin]);

  useEffect(() => {
    fetchDeploys();
  }, [fetchDeploys]);

  const updateDeploy = useCallback(async (deployId: string, fields: Partial<ProjectDeploy>) => {
    await supabase
      .from('project_deploys')
      .update(fields)
      .eq('id', deployId);
    await fetchDeploys();
  }, [fetchDeploys]);

  const deleteDeploy = useCallback(async (deployId: string) => {
    await supabase
      .from('project_deploys')
      .delete()
      .eq('id', deployId);
    await fetchDeploys();
  }, [fetchDeploys]);

  return { deploys, loading, refetch: fetchDeploys, updateDeploy, deleteDeploy };
}
