import { useAuth } from '../hooks/useAuth';
import { useFiles } from '../hooks/useFiles';
import { FilesList } from '../components/client/FilesList';
import { Topbar } from '../components/layout/Topbar';
import { Loader2 } from 'lucide-react';
import '../portal.css';

export function ClientFiles() {
  const { profile } = useAuth();
  const { files, loading: filesLoading, uploading, uploadFile } = useFiles(profile?.id);

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-[#00bcd4] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Topbar title="Fajlovi" />
      <main className="px-6 py-5">
          <div className="portal-card portal-animate-in max-w-3xl">
            <h3 className="text-[13px] font-medium text-[#1a2030] mb-4">
              Dokumenti i materijali
            </h3>
            {filesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-5 h-5 text-[#00bcd4] animate-spin" />
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
    </>
  );
}
