import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  MessageSquare,
  FolderOpen,
  LogOut,
  Users,
  UserCircle2,
  PlusCircle,
} from 'lucide-react';

interface SidebarProps {
  projectName?: string;
  projectDomain?: string;
  projectStatus?: string;
  packageName?: string;
  packagePrice?: number | null;
  unreadCount?: number;
}

const statusLabels: Record<string, string> = {
  active: 'Aktivan',
  paused: 'Pauziran',
  completed: 'Završen',
};

export function Sidebar({
  projectName,
  projectDomain,
  projectStatus = 'active',
  packageName,
  packagePrice,
  unreadCount = 0,
}: SidebarProps) {
  const { isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/portal/login', { replace: true });
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13px] transition-all duration-150 ${
      isActive
        ? 'bg-[#F4F2EE] text-[#1A1916] font-medium'
        : 'text-[#7A7870] hover:bg-[#F7F6F3]'
    }`;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="portal-sidebar hidden md:flex flex-col">
        <div className="px-5 py-5 border-b border-[#E0DDD6]">
          <img
            src="/images/aisajt nav.png"
            alt="AiSajt"
            className="h-6 w-auto object-contain"
          />
          {!isAdmin && projectName && (
            <div className="mt-3">
              <p className="text-[12px] text-[#9A9890]">Projekat</p>
              <p className="text-[13px] font-medium text-[#3D3C38] truncate mt-0.5">{projectName}</p>
              {projectDomain && (
                <p className="text-[12px] text-[#9A9890] mt-0.5">{projectDomain}</p>
              )}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-[6px] h-[6px] rounded-full bg-[#22A06B]" />
                <span
                  className="text-[11px] px-2 py-0.5 rounded-full"
                  style={{
                    background: projectStatus === 'active' ? '#E8F6EF' : projectStatus === 'paused' ? '#FFF3E0' : '#EDE9FF',
                    color: projectStatus === 'active' ? '#22A06B' : projectStatus === 'paused' ? '#E8902A' : '#6B4FBB',
                  }}
                >
                  {statusLabels[projectStatus] || projectStatus}
                </span>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {isAdmin ? (
            <>
              <NavLink to="/portal/admin" end className={navLinkClass}>
                <Users size={16} />
                Projekti
              </NavLink>
              <NavLink to="/portal/admin/klijenti" className={navLinkClass}>
                <UserCircle2 size={16} />
                Klijenti
              </NavLink>
              <NavLink to="/portal/admin/projekti/novi" className={navLinkClass}>
                <PlusCircle size={16} />
                Novi projekat
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/portal/dashboard" end className={navLinkClass}>
                <LayoutDashboard size={16} />
                Dashboard
              </NavLink>
              <NavLink to="/portal/dashboard/poruke" className={navLinkClass}>
                <div className="relative">
                  <MessageSquare size={16} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#FF4D4D] text-[10px] text-white flex items-center justify-center font-medium">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                Poruke
              </NavLink>
              <NavLink to="/portal/dashboard/fajlovi" className={navLinkClass}>
                <FolderOpen size={16} />
                Fajlovi
              </NavLink>
            </>
          )}
        </nav>


        <div className="p-3 border-t border-[#E0DDD6]">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13px] text-[#7A7870] hover:text-[#FF4D4D] hover:bg-[#FFF5F5] transition-all duration-150 w-full"
          >
            <LogOut size={16} />
            Odjavi se
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E0DDD6] z-50 flex items-center justify-around px-2">
        {isAdmin ? (
          <>
            <NavLink to="/portal/admin" end className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] py-1 px-3 ${isActive ? 'text-[#6B4FBB]' : 'text-[#7A7870]'}`
            }>
              <Users size={20} />
              Projekti
            </NavLink>
            <NavLink to="/portal/admin/klijenti" className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] py-1 px-3 ${isActive ? 'text-[#6B4FBB]' : 'text-[#7A7870]'}`
            }>
              <UserCircle2 size={20} />
              Klijenti
            </NavLink>
            <NavLink to="/portal/admin/projekti/novi" className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] py-1 px-3 ${isActive ? 'text-[#6B4FBB]' : 'text-[#7A7870]'}`
            }>
              <PlusCircle size={20} />
              Novi
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/portal/dashboard" end className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] py-1 px-3 ${isActive ? 'text-[#6B4FBB]' : 'text-[#7A7870]'}`
            }>
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>
            <NavLink to="/portal/dashboard/poruke" className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] py-1 px-3 relative ${isActive ? 'text-[#6B4FBB]' : 'text-[#7A7870]'}`
            }>
              <div className="relative">
                <MessageSquare size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FF4D4D] text-[9px] text-white flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              Poruke
            </NavLink>
            <NavLink to="/portal/dashboard/fajlovi" className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] py-1 px-3 ${isActive ? 'text-[#6B4FBB]' : 'text-[#7A7870]'}`
            }>
              <FolderOpen size={20} />
              Fajlovi
            </NavLink>
          </>
        )}
        <button
          onClick={handleSignOut}
          className="flex flex-col items-center gap-1 text-[11px] py-1 px-3 text-[#7A7870]"
        >
          <LogOut size={20} />
          Odjava
        </button>
      </nav>
    </>
  );
}
