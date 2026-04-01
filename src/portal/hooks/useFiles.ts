import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { ProjectFile } from '../lib/types';

function getFileType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
  if (ext === 'pdf') return 'pdf';
  return 'document';
}

export function useFiles(projectId: string | undefined) {
  const { profile } = useAuth();
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);

    const { data } = await supabase
      .from('project_files')
      .select('*, uploader:profiles!uploaded_by(id, full_name, role)')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    setFiles((data as unknown as ProjectFile[]) || []);
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const uploadFile = useCallback(async (file: File) => {
    if (!projectId || !profile) return;
    setUploading(true);

    try {
      const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const path = `${projectId}/${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('project-files')
        .getPublicUrl(path);

      await supabase.from('project_files').insert({
        project_id: projectId,
        uploaded_by: profile.id,
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_type: getFileType(file.name),
      });

      await fetchFiles();
    } finally {
      setUploading(false);
    }
  }, [projectId, profile, fetchFiles]);

  return { files, loading, uploading, uploadFile, refetch: fetchFiles };
}
