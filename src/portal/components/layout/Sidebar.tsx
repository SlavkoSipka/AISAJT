import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useProject } from '../../hooks/useProject';
import { useMessages } from '../../hooks/useMessages';
import { getSeoPlanDisplay } from '../../lib/seoPlans';
import {
  LayoutDashboard,
  MessageSquare,
  FolderOpen,
  LogOut,
  Users,
  UserCircle2,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';

const statusLabels: Record<string, string> = {
  active: 'Aktivan',
  paused: 'Pauziran',
  completed: 'Završen',
};

export function Sidebar() {
  const { isAdmin, signOut, profile } = useAuth();
  const { project, seoProject } = useProject();
  const { unreadCount } = useMessages(profile?.id);
  const [adminUnread, setAdminUnread] = useState(0);

  useEffect(() => {
    if (!isAdmin || !profile?.id) return;

    const fetchAdminUnread = async () => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .neq('sender_id', profile.id);
      setAdminUnread(count || 0);
    };

    fetchAdminUnread();

    const channel = supabase
      .channel('admin-sidebar-unread')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchAdminUnread)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, profile?.id]);

  const projectName = project?.name || seoProject?.domain;
  const projectDomain = project?.domain || seoProject?.domain || undefined;
  const projectStatus = project?.status || 'active';

  // SEO package info
  const seoPlanDisplay = getSeoPlanDisplay(seoProject?.package_name, seoProject?.package_price);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/portal/login', { replace: true });
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13px] transition-all duration-150 ${
      isActive
        ? 'bg-[rgba(0,188,212,0.15)] text-[#00d4f5] font-medium'
        : 'text-[rgba(255,255,255,0.55)] hover:bg-[rgba(255,255,255,0.08)] hover:text-[rgba(255,255,255,0.9)]'
    }`;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="portal-sidebar hidden md:flex flex-col">
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center justify-center">
            <img
              src="/images/aisajt_providno-removebg-preview.png" width={500} height={180}
              alt="AiSajt"
              className="h-8 w-auto object-contain opacity-90" loading="lazy" />
          </div>
          {!isAdmin && projectName && (
            <div className="mt-3 bg-[rgba(255,255,255,0.07)] rounded-lg p-[10px]">
              <p className="text-[12px] text-[rgba(255,255,255,0.4)]">Projekat</p>
              <p className="text-[13px] font-medium text-white truncate mt-0.5">{project?.name || seoProject?.domain}</p>
              {projectDomain && (
                <p className="text-[12px] text-[rgba(255,255,255,0.4)] mt-0.5">{projectDomain}</p>
              )}
              {seoPlanDisplay && (
                <p className="text-[11px] text-[#00e5ff] mt-1.5">
                  SEO: {seoPlanDisplay}
                </p>
              )}
              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className="text-[11px] px-2 py-0.5 rounded-full"
                  style={{
                    background: projectStatus === 'active' ? 'rgba(0,188,212,0.2)' : projectStatus === 'paused' ? 'rgba(232,151,10,0.2)' : 'rgba(108,79,219,0.2)',
                    color: projectStatus === 'active' ? '#00e5ff' : projectStatus === 'paused' ? '#ffb74d' : '#b39ddb',
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
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[rgba(255,255,255,0.3)] px-3 pt-2 pb-1">
                Izrada sajtova
              </p>
              <NavLink to="/portal/admin" end className={navLinkClass}>
                <Users size={16} />
                Projekti
              </NavLink>
              <NavLink to="/portal/admin/klijenti" className={navLinkClass}>
                <UserCircle2 size={16} />
                Klijenti
              </NavLink>
              <NavLink to="/portal/admin/poruke" className={navLinkClass}>
                <div className="relative">
                  <MessageSquare size={16} />
                  {adminUnread > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#e53e3e] text-[10px] text-white flex items-center justify-center font-medium">
                      {adminUnread > 9 ? '9+' : adminUnread}
                    </span>
                  )}
                </div>
                Poruke
              </NavLink>
              <NavLink to="/portal/admin/projekti/novi" className={navLinkClass}>
                <PlusCircle size={16} />
                Novi projekat
              </NavLink>
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[rgba(255,255,255,0.3)] px-3 pt-3 pb-1">
                SEO
              </p>
              <NavLink to="/portal/admin/seo" end className={navLinkClass}>
                <TrendingUp size={16} />
                SEO projekti
              </NavLink>
              <NavLink to="/portal/admin/seo/novi" className={navLinkClass}>
                <PlusCircle size={16} />
                Novi SEO projekat
              </NavLink>
            </>
          ) : (
            <>
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[rgba(255,255,255,0.3)] px-3 pt-2 pb-1">
                Moj sajt
              </p>
              <NavLink to="/portal/dashboard" end className={navLinkClass}>
                <LayoutDashboard size={16} />
                Dashboard
              </NavLink>
              <NavLink to="/portal/dashboard/poruke" className={navLinkClass}>
                <div className="relative">
                  <MessageSquare size={16} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#e53e3e] text-[10px] text-white flex items-center justify-center font-medium">
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
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[rgba(255,255,255,0.3)] px-3 pt-3 pb-1">
                SEO
              </p>
              <NavLink to="/portal/seo" className={navLinkClass}>
                <TrendingUp size={16} />
                SEO Dashboard
              </NavLink>
            </>
          )}
        </nav>


        <div className="p-3 border-t border-[rgba(255,255,255,0.08)]">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13px] text-[rgba(255,255,255,0.55)] hover:text-[#e53e3e] hover:bg-[rgba(229,62,62,0.1)] transition-all duration-150 w-full"
          >
            <LogOut size={16} />
            Odjavi se
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#1a1f4e] border-t border-[rgba(255,255,255,0.08)] z-50 flex items-center justify-around px-2">
        {isAdmin ? (
          <>
            <NavLink to="/portal/admin" end className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] py-1 px-2 ${isActive ? 'text-[#00d4f5]' : 'text-[rgba(255,255,255,0.55)]'}`
            }>
              <Users size={20} />
              Projekti
            </NavLink>
            <NavLink to="/portal/admin/klijenti" className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] py-1 px-2 ${isActive ? 'text-[#00d4f5]' : 'text-[rgba(255,255,255,0.55)]'}`
            }>
              <UserCircle2 size={20} />
              Klijenti
            </NavLink>
            <NavLink to="/portal/admin/poruke" className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] py-1 px-2 relative ${isActive ? 'text-[#00d4f5]' : 'text-[rgba(255,255,255,0.55)]'}`
            }>
              <div className="relative">
                <MessageSquare size={20} />
                {adminUnread > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#e53e3e] text-[9px] text-white flex items-center justify-center font-medium">
                    {adminUnread > 9 ? '9+' : adminUnread}
                  </span>
                )}
              </div>
              Poruke
            </NavLink>
            <NavLink to="/portal/admin/seo" end className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] py-1 px-2 ${isActive ? 'text-[#00d4f5]' : 'text-[rgba(255,255,255,0.55)]'}`
            }>
              <TrendingUp size={20} />
              SEO
            </NavLink>
            <NavLink to="/portal/admin/projekti/novi" className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] py-1 px-2 ${isActive ? 'text-[#00d4f5]' : 'text-[rgba(255,255,255,0.55)]'}`
            }>
              <PlusCircle size={20} />
              Novi
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/portal/dashboard" end className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] py-1 px-2 ${isActive ? 'text-[#00d4f5]' : 'text-[rgba(255,255,255,0.55)]'}`
            }>
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>
            <NavLink to="/portal/dashboard/poruke" className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] py-1 px-2 relative ${isActive ? 'text-[#00d4f5]' : 'text-[rgba(255,255,255,0.55)]'}`
            }>
              <div className="relative">
                <MessageSquare size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#e53e3e] text-[9px] text-white flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              Poruke
            </NavLink>
            <NavLink to="/portal/dashboard/fajlovi" className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] py-1 px-2 ${isActive ? 'text-[#00d4f5]' : 'text-[rgba(255,255,255,0.55)]'}`
            }>
              <FolderOpen size={20} />
              Fajlovi
            </NavLink>
            <NavLink to="/portal/seo" className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[11px] py-1 px-2 ${isActive ? 'text-[#00d4f5]' : 'text-[rgba(255,255,255,0.55)]'}`
            }>
              <TrendingUp size={20} />
              SEO
            </NavLink>
          </>
        )}
        <button
          onClick={handleSignOut}
          className="flex flex-col items-center gap-1 text-[11px] py-1 px-3 text-[rgba(255,255,255,0.55)]"
        >
          <LogOut size={20} />
          Odjava
        </button>
      </nav>
    </>
  );
}
