import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ProjectProvider } from '../../context/ProjectProvider';
import '../../portal.css';

export function PortalLayout() {
  return (
    <ProjectProvider>
      <div className="portal-root">
        <Sidebar />
        <div className="md:ml-[210px] min-h-screen pb-20 md:pb-0">
          <Outlet />
        </div>
      </div>
    </ProjectProvider>
  );
}
