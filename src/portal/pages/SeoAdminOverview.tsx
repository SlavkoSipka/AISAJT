import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Topbar } from '../components/layout/Topbar';
import { Loader2, PlusCircle, TrendingUp, Globe } from 'lucide-react';
import type { SeoProject, SeoMetrics, Profile, SeoProjectWithClient } from '../lib/types';
import { getSeoPlanDisplay } from '../lib/seoPlans';
import '../portal.css';

export function SeoAdminOverview() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<SeoProjectWithClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);

      const { data: seoProjects } = await supabase
        .from('seo_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!seoProjects || seoProjects.length === 0) {
        setProjects([]);
        setLoading(false);
        return;
      }

      const clientIds = [...new Set((seoProjects as SeoProject[]).map(p => p.client_id))];
      const projectIds = (seoProjects as SeoProject[]).map(p => p.id);

      const [{ data: profiles }, { data: allMetrics }] = await Promise.all([
        supabase.from('profiles').select('*').in('id', clientIds),
        supabase
          .from('seo_metrics')
          .select('*')
          .in('seo_project_id', projectIds)
          .order('month', { ascending: false }),
      ]);

      const profileMap = new Map((profiles as Profile[] || []).map(p => [p.id, p]));

      // Keep only latest metrics per project
      const latestMetricsMap = new Map<string, SeoMetrics>();
      (allMetrics as SeoMetrics[] || []).forEach(m => {
        if (!latestMetricsMap.has(m.seo_project_id)) {
          latestMetricsMap.set(m.seo_project_id, m);
        }
      });

      const enriched: SeoProjectWithClient[] = (seoProjects as SeoProject[]).map(p => ({
        ...p,
        client: profileMap.get(p.client_id) || {
          id: p.client_id,
          full_name: 'Nepoznat',
          role: 'client' as const,
          avatar_url: null,
          created_at: '',
        },
        latest_metrics: latestMetricsMap.get(p.id) || null,
      }));

      setProjects(enriched);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <>
      <Topbar title="SEO Projekti" />
      <main className="px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[16px] font-semibold text-[#1a2030] tracking-[-0.3px]">
              SEO projekti ({projects.length})
            </h2>
            <Link
              to="/portal/admin/seo/novi"
              className="portal-btn portal-btn-primary text-[13px]"
            >
              <PlusCircle size={16} />
              Novi SEO projekat
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 text-[#00bcd4] animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="portal-card text-center py-16">
              <TrendingUp className="w-10 h-10 mx-auto mb-3 text-[#e3e7ee]" />
              <p className="text-[14px] text-[#1a2030] mb-1">Nema SEO projekata</p>
              <p className="text-[13px] text-[#9aa3b2]">Kreirajte prvi SEO projekat za klijenta.</p>
            </div>
          ) : (
            <div className="portal-card p-0 overflow-hidden">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[#e3e7ee]">
                    <th className="text-left px-4 py-3 text-[11px] font-medium text-[#9aa3b2] uppercase tracking-wide">Klijent / Domen</th>
                    <th className="text-left px-4 py-3 text-[11px] font-medium text-[#9aa3b2] uppercase tracking-wide">Paket</th>
                    <th className="text-right px-4 py-3 text-[11px] font-medium text-[#9aa3b2] uppercase tracking-wide">Poseti</th>
                    <th className="text-right px-4 py-3 text-[11px] font-medium text-[#9aa3b2] uppercase tracking-wide">Avg. pozicija</th>
                    <th className="text-right px-4 py-3 text-[11px] font-medium text-[#9aa3b2] uppercase tracking-wide">Backlinks</th>
                    <th className="text-right px-4 py-3 text-[11px] font-medium text-[#9aa3b2] uppercase tracking-wide">Obnova</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => {
                    const planDisplay = getSeoPlanDisplay(p.package_name, p.package_price);
                    return (
                    <tr
                      key={p.id}
                      onClick={() => navigate(`/portal/admin/seo/${p.id}`)}
                      className="border-b border-[#f7f8fa] hover:bg-[#f7f8fa] cursor-pointer transition-colors last:border-none"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#1a2030] text-[13px]">{p.client.full_name || 'Nepoznat'}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Globe size={11} className="text-[#9aa3b2]" />
                          <span className="text-[11px] text-[#9aa3b2]">{p.domain}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {planDisplay ? (
                          <span className="text-[12px] font-medium text-[#1a2030]">{planDisplay}</span>
                        ) : (
                          <span className="text-[12px] text-[#9aa3b2]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {p.latest_metrics ? (
                          <span className="font-semibold text-[#00bcd4]">
                            {p.latest_metrics.organic_visits.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-[#9aa3b2]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {p.latest_metrics?.avg_position != null ? (
                          <span className="font-semibold text-[#0faa6e]">
                            {p.latest_metrics.avg_position.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-[#9aa3b2]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {p.latest_metrics ? (
                          <span className="text-[#1a2030]">{p.latest_metrics.total_backlinks}</span>
                        ) : (
                          <span className="text-[#9aa3b2]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {p.renewal_date ? (
                          <span className="text-[12px] text-[#5a6478]">
                            {new Date(p.renewal_date).toLocaleDateString('sr-Latn', { day: 'numeric', month: 'short' })}
                          </span>
                        ) : (
                          <span className="text-[#9aa3b2]">—</span>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
    </>
  );
}
