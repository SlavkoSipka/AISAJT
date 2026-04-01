import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { Loader2, UserPlus, User, FolderOpen } from 'lucide-react';
import type { Profile } from '../lib/types';
import '../portal.css';

interface ClientRow {
  profile: Profile;
  projectCount: number;
}

export function AdminClients() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    setLoading(true);

    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'client')
      .order('created_at', { ascending: false });

    if (!profiles || profiles.length === 0) {
      setClients([]);
      setLoading(false);
      return;
    }

    const ids = (profiles as Profile[]).map(p => p.id);

    const { data: projectCounts } = await supabase
      .from('projects')
      .select('client_id')
      .in('client_id', ids);

    const countMap = new Map<string, number>();
    (projectCounts || []).forEach((row: { client_id: string }) => {
      countMap.set(row.client_id, (countMap.get(row.client_id) || 0) + 1);
    });

    setClients(
      (profiles as Profile[]).map(p => ({
        profile: p,
        projectCount: countMap.get(p.id) || 0,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="portal-root">
      <Sidebar />
      <div className="md:ml-[220px] min-h-screen pb-20 md:pb-0">
        <Topbar title="Klijenti" />
        <main className="px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[16px] font-semibold text-[#1A1916] tracking-[-0.3px]">
              Klijenti ({clients.length})
            </h2>
            <Link
              to="/portal/admin/klijenti/novi"
              className="portal-btn portal-btn-primary text-[13px]"
            >
              <UserPlus size={16} />
              Dodaj klijenta
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 text-[#6B4FBB] animate-spin" />
            </div>
          ) : clients.length === 0 ? (
            <div className="portal-card text-center py-16">
              <User size={36} className="text-[#B8B5AE] mx-auto mb-3" />
              <p className="text-[#3D3C38] font-medium text-[14px] mb-1">Nema klijenata</p>
              <p className="text-[#9A9890] text-[13px] mb-5">
                Dodajte prvog klijenta da biste počeli.
              </p>
              <Link
                to="/portal/admin/klijenti/novi"
                className="portal-btn portal-btn-primary text-[13px] inline-flex"
              >
                <UserPlus size={16} />
                Dodaj klijenta
              </Link>
            </div>
          ) : (
            <div className="portal-card overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-[#E0DDD6]">
                    <th className="text-left py-3 px-4 text-[11px] text-[#9A9890] font-medium">
                      Klijent
                    </th>
                    <th className="text-left py-3 px-4 text-[11px] text-[#9A9890] font-medium">
                      Projekti
                    </th>
                    <th className="text-left py-3 px-4 text-[11px] text-[#9A9890] font-medium">
                      Dodat
                    </th>
                    <th className="py-3 px-4" />
                  </tr>
                </thead>
                <tbody>
                  {clients.map(({ profile, projectCount }) => (
                    <tr
                      key={profile.id}
                      className="border-b border-[#F0EDE7] hover:bg-[#F7F6F3] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#EDE9FF] flex items-center justify-center shrink-0">
                            <User size={14} className="text-[#6B4FBB]" />
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-[#1A1916]">
                              {profile.full_name || '—'}
                            </p>
                            <p className="text-[11px] text-[#B8B5AE]">{profile.id.slice(0, 8)}…</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-[13px] text-[#3D3C38]">
                          <FolderOpen size={14} className="text-[#9A9890]" />
                          {projectCount}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[13px] text-[#3D3C38]">
                          {new Date(profile.created_at).toLocaleDateString('sr-Latn', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to="/portal/admin/projekti/novi"
                          state={{ clientId: profile.id, clientName: profile.full_name }}
                          className="text-[12px] text-[#6B4FBB] hover:underline transition-colors"
                        >
                          + Novi projekat
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
