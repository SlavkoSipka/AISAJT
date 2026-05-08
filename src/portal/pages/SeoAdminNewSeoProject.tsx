import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Topbar } from '../components/layout/Topbar';
import { Loader2, ArrowLeft } from 'lucide-react';
import type { Profile } from '../lib/types';
import { SEO_PLAN_OPTIONS, getSeoPlanByKey, type SeoPlanKey } from '../lib/seoPlans';
import '../portal.css';

export function SeoAdminNewSeoProject() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedClientId = searchParams.get('clientId') || '';

  const [clients, setClients] = useState<Profile[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<{
    clientId: string;
    domain: string;
    planKey: SeoPlanKey;
    renewalDate: string;
  }>({
    clientId: preselectedClientId,
    domain: '',
    planKey: 'start' as SeoPlanKey,
    renewalDate: '',
    showBacklinks: true,
  });

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .eq('role', 'client')
      .order('full_name')
      .then(({ data }) => {
        setClients((data as Profile[]) || []);
        setLoadingClients(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientId || !form.domain.trim()) {
      setError('Izaberite klijenta i unesite domen.');
      return;
    }

    setSubmitting(true);
    setError('');

    const selectedPlan = getSeoPlanByKey(form.planKey);

    const { data, error: insertError } = await supabase
      .from('seo_projects')
      .insert({
        client_id: form.clientId,
        domain: form.domain.trim(),
        package_name: selectedPlan.name,
        package_price: selectedPlan.price,
        renewal_date: form.renewalDate || null,
        show_backlinks: form.showBacklinks,
      })
      .select()
      .single();

    if (insertError || !data) {
      setError(insertError?.message || 'Greška pri kreiranju projekta.');
      setSubmitting(false);
      return;
    }

    navigate(`/portal/admin/seo/${data.id}`);
  };

  const set = (field: 'clientId' | 'domain' | 'renewalDate') => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <>
      <Topbar title="Novi SEO projekat" />
      <main className="px-6 py-5 max-w-xl">

          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => navigate('/portal/admin/seo')}
              className="flex items-center gap-1.5 text-[13px] text-[#5a6478] hover:text-[#1a2030] transition-colors">
              <ArrowLeft size={16} />
              SEO projekti
            </button>
          </div>

          <div className="portal-card">
            <h2 className="text-[15px] font-semibold text-[#1a2030] mb-5">Novi SEO projekat</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-[11px] font-medium text-[#5a6478] mb-1.5">Klijent *</label>
                {loadingClients ? (
                  <div className="flex items-center gap-2 text-[13px] text-[#9aa3b2]">
                    <Loader2 size={14} className="animate-spin" />
                    Učitavanje...
                  </div>
                ) : (
                  <>
                    <select
                      className="portal-input"
                      value={form.clientId}
                      onChange={set('clientId')}
                      required
                    >
                      <option value="">— Izaberite klijenta —</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.full_name || c.id}</option>
                      ))}
                    </select>
                    <p className="text-[11px] text-[#9aa3b2] mt-1">
                      Nema klijenta?{' '}
                      <Link to="/portal/admin/klijenti/novi" className="text-[#00bcd4] hover:underline">
                        Kreirajte novog
                      </Link>
                    </p>
                  </>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#5a6478] mb-1.5">Domen *</label>
                <input
                  type="text"
                  className="portal-input"
                  placeholder="primer.rs"
                  value={form.domain}
                  onChange={set('domain')}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#5a6478] mb-1.5">SEO plan</label>
                <select
                  className="portal-input"
                  value={form.planKey}
                  onChange={e => setForm(p => ({ ...p, planKey: e.target.value as SeoPlanKey }))}
                >
                  {SEO_PLAN_OPTIONS.map(plan => (
                    <option key={plan.key} value={plan.key}>
                      {plan.name} — €{plan.price}/mes
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#5a6478] mb-1.5">Datum obnove</label>
                <input
                  type="date"
                  className="portal-input"
                  value={form.renewalDate}
                  onChange={set('renewalDate')}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-[#e3e7ee] bg-[#f7f8fa]">
                <div>
                  <p className="text-[12px] font-medium text-[#1a2030]">Prikaži backlinks klijentu</p>
                  <p className="text-[11px] text-[#9aa3b2] mt-0.5">Ako je isključeno — sekcija je zamagljena sa ponudom nadogradnje</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, showBacklinks: !p.showBacklinks }))}
                  className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${form.showBacklinks ? 'bg-[#00bcd4]' : 'bg-[#e3e7ee]'}`}>
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${form.showBacklinks ? 'left-5' : 'left-1'}`} />
                </button>
              </div>

              {error && (
                <p className="text-[12px] text-[#FF4D4D] bg-[#FFF5F5] border border-[#FFD0D0] rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="portal-btn portal-btn-primary w-full"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                Kreiraj SEO projekat
              </button>
            </form>
          </div>
        </main>
    </>
  );
}
