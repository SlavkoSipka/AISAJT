import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import '../../portal.css';

interface PortalLayoutProps {
  projectName?: string;
  projectDomain?: string;
  projectStatus?: string;
  packageName?: string;
  packagePrice?: number | null;
  unreadCount?: number;
  topbarTitle?: string;
}

export function PortalLayout({
  projectName,
  projectDomain,
  projectStatus,
  packageName,
  packagePrice,
  unreadCount,
  topbarTitle,
}: PortalLayoutProps) {
  return (
    <div className="portal-root">
      <Sidebar
        projectName={projectName}
        projectDomain={projectDomain}
        projectStatus={projectStatus}
        packageName={packageName}
        packagePrice={packagePrice}
        unreadCount={unreadCount}
      />
      <div className="md:ml-[220px] min-h-screen pb-20 md:pb-0">
        <Topbar title={topbarTitle} />
        <main className="px-6 py-5 portal-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
