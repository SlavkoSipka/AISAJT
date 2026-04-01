import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProject } from '../hooks/useProject';
import { useMessages } from '../hooks/useMessages';
import { useDeploys } from '../hooks/useDeploys';
import { ProjectHeader } from '../components/client/ProjectHeader';
import { StepsTimeline } from '../components/client/StepsTimeline';
import { PreviewCard } from '../components/client/PreviewCard';
import { MessageThread } from '../components/client/MessageThread';
import { ActivityChart } from '../components/client/ActivityChart';
import { DeployFeed } from '../components/client/DeployFeed';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { Loader2, ArrowRight } from 'lucide-react';
import '../portal.css';

export function ClientDashboard() {
  const { profile } = useAuth();
  const { project, steps, loading, progressPercentage, estimatedCompletion } = useProject();
  const { messages, unreadCount, sendMessage, markAsRead } = useMessages(project?.id, 3);
  const { deploys } = useDeploys(project?.id);

  useEffect(() => {
    if (project?.id) markAsRead();
  }, [project?.id, markAsRead]);

  if (loading) {
    return (
      <div className="portal-root flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 text-[#6B4FBB] animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="portal-root">
        <Sidebar />
        <div className="md:ml-[220px] min-h-screen pb-20 md:pb-0">
          <Topbar title="Dashboard" />
          <main className="px-6 py-5 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <p className="text-[#3D3C38] text-base mb-2">
                Nemate dodeljene projekte
              </p>
              <p className="text-[#9A9890] text-[13px]">
                Kontaktirajte AiSajt tim za više informacija.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-root">
      <Sidebar
        projectName={project.name}
        projectDomain={project.domain || undefined}
        projectStatus={project.status}
        packageName={project.package_name || undefined}
        packagePrice={project.package_price}
        unreadCount={unreadCount}
      />
      <div className="md:ml-[220px] min-h-screen pb-20 md:pb-0">
        <Topbar title={project.name} />
        <main className="px-6 py-5 space-y-5 portal-scrollbar">
          {/* Top row: 3 metric cards */}
          <ProjectHeader
            project={project}
            progressPercentage={progressPercentage}
            estimatedCompletion={estimatedCompletion}
          />

          {/* Preview link (compact) */}
          {project.netlify_preview_url && (
            <PreviewCard previewUrl={project.netlify_preview_url} />
          )}

          {/* Two-column layout: steps left, messages + activity + deploys right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: steps (~55%) */}
            <div className="lg:col-span-7">
              <StepsTimeline steps={steps} />
            </div>

            {/* Right: messages + activity + deploy feed (~45%) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="portal-card portal-animate-in" style={{ animationDelay: '0.15s' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-medium text-[#1A1916]">
                    Poruke
                  </h3>
                  <Link
                    to="/portal/dashboard/poruke"
                    className="text-[12px] text-[#6B4FBB] hover:text-[#4A3490] flex items-center gap-1 transition-colors"
                  >
                    Vidi sve
                    <ArrowRight size={12} />
                  </Link>
                </div>
                <MessageThread
                  messages={messages}
                  currentUserId={profile?.id || ''}
                  onSend={sendMessage}
                  compact
                />
              </div>

              <ActivityChart deploys={deploys} />

              <DeployFeed deploys={deploys} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
