import { useProject } from '../hooks/useProject';
import { useFiles } from '../hooks/useFiles';
import { FilesList } from '../components/client/FilesList';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { Loader2 } from 'lucide-react';
import '../portal.css';

export function ClientFiles() {
  const { project, loading: projectLoading } = useProject();
  const { files, loading: filesLoading, uploading, uploadFile } = useFiles(project?.id);

  if (projectLoading) {
    return (
      <div className="portal-root flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 text-[#6B4FBB] animate-spin" />
      </div>
    );
  }

  return (
    <div className="portal-root">
      <Sidebar
        projectName={project?.name}
        projectDomain={project?.domain || undefined}
        projectStatus={project?.status}
        packageName={project?.package_name || undefined}
        packagePrice={project?.package_price}
      />
      <div className="md:ml-[220px] min-h-screen pb-20 md:pb-0">
        <Topbar title="Fajlovi" />
        <main className="px-6 py-5">
          <div className="portal-card portal-animate-in max-w-3xl">
            <h3 className="text-[13px] font-medium text-[#1A1916] mb-4">
              Dokumenti i materijali
            </h3>
            {filesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-5 h-5 text-[#6B4FBB] animate-spin" />
              </div>
            ) : (
              <FilesList
                files={files}
                uploading={uploading}
                onUpload={uploadFile}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
