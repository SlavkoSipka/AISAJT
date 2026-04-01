import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProject } from '../hooks/useProject';
import { useMessages } from '../hooks/useMessages';
import { MessageThread } from '../components/client/MessageThread';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { Loader2 } from 'lucide-react';
import '../portal.css';

export function ClientMessages() {
  const { profile } = useAuth();
  const { project, loading: projectLoading } = useProject();
  const { messages, loading: messagesLoading, unreadCount, sendMessage, markAsRead } = useMessages(project?.id);

  useEffect(() => {
    if (project?.id) markAsRead();
  }, [project?.id, messages.length, markAsRead]);

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
        unreadCount={unreadCount}
      />
      <div className="md:ml-[220px] min-h-screen pb-20 md:pb-0">
        <Topbar title="Poruke" />
        <main className="px-6 py-5">
          <div className="portal-card portal-animate-in max-w-3xl">
            <h3 className="text-[13px] font-medium text-[#1A1916] mb-4">
              Konverzacija
            </h3>
            {messagesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-5 h-5 text-[#6B4FBB] animate-spin" />
              </div>
            ) : (
              <MessageThread
                messages={messages}
                currentUserId={profile?.id || ''}
                onSend={sendMessage}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
