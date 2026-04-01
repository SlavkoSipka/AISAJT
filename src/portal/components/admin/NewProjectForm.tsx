import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, FolderPlus, ChevronDown, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { readErrorFromResponse } from '../../lib/http';
import type { Profile } from '../../lib/types';

interface FormData {
  clientId: string;
  projectName: string;
  domain: string;
  packageName: string;
  packagePrice: string;
  netlifyPreviewUrl: string;
}

const initialForm: FormData = {
  clientId: '',
  projectName: '',
  domain: '',
  packageName: '',
  packagePrice: '',
  netlifyPreviewUrl: '',
};

interface LocationState {
  clientId?: string;
  clientName?: string;
}

export function NewProjectForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [clients, setClients] = useState<Profile[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as LocationState | null;
    if (state?.clientId) {
      setForm(prev => ({ ...prev, clientId: state.clientId! }));
    }
  }, [location.state]);

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

  const update = (field: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/.netlify/functions/create-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: form.clientId,
          projectName: form.projectName,
          domain: form.domain || null,
          packageName: form.packageName || null,
          packagePrice: form.packagePrice ? Number(form.packagePrice) : null,
          netlifyPreviewUrl: form.netlifyPreviewUrl || null,
        }),
      });

      if (!res.ok) {
        throw new Error(await readErrorFromResponse(res));
      }

      navigate('/portal/admin', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Nepoznata greška');
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = 'portal-input text-[13px]';
  const labelClass = 'block text-[11px] text-[#9A9890] font-medium mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="portal-card">
        <h4 className="text-[13px] font-medium text-[#1A1916] mb-1 flex items-center gap-2">
          <FolderPlus size={16} className="text-[#6B4FBB]" />
          Klijent
        </h4>
        <p className="text-[12px] text-[#9A9890] mb-4">
          Izaberite postojećeg klijenta. Nema klijenta?{' '}
          <Link to="/portal/admin/klijenti/novi" className="text-[#6B4FBB] hover:underline">
            Dodaj novog klijenta
          </Link>
        </p>

        {loadingClients ? (
          <div className="flex items-center gap-2 text-[#9A9890] text-[13px]">
            <Loader2 size={14} className="animate-spin" />
            Učitavanje...
          </div>
        ) : clients.length === 0 ? (
          <div className="rounded-lg bg-[#EDE9FF]/40 border border-[#6B4FBB]/15 px-4 py-3 text-[13px] text-[#6B4FBB] flex items-center gap-2">
            <UserPlus size={16} />
            Nema klijenata.{' '}
            <Link to="/portal/admin/klijenti/novi" className="underline font-medium">
              Dodaj prvog klijenta
            </Link>
          </div>
        ) : (
          <div className="relative">
            <select
              value={form.clientId}
              onChange={e => update('clientId', e.target.value)}
              className={`${fieldClass} appearance-none pr-8`}
              required
            >
              <option value="">— Izaberi klijenta —</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.full_name || c.id}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9890]"
            />
          </div>
        )}
      </div>

      <div className="portal-card">
        <h4 className="text-[13px] font-medium text-[#1A1916] mb-4">
          Podaci o projektu
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Naziv projekta *</label>
            <input
              value={form.projectName}
              onChange={e => update('projectName', e.target.value)}
              className={fieldClass}
              placeholder='npr. "BeautyClinic Beograd"'
              required
            />
          </div>
          <div>
            <label className={labelClass}>Domen</label>
            <input
              value={form.domain}
              onChange={e => update('domain', e.target.value)}
              className={fieldClass}
              placeholder="npr. beautyclinic.rs"
            />
          </div>
          <div>
            <label className={labelClass}>Netlify Preview URL</label>
            <input
              value={form.netlifyPreviewUrl}
              onChange={e => update('netlifyPreviewUrl', e.target.value)}
              className={fieldClass}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      <div className="portal-card">
        <h4 className="text-[13px] font-medium text-[#1A1916] mb-4">
          Paket
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Naziv paketa</label>
            <input
              value={form.packageName}
              onChange={e => update('packageName', e.target.value)}
              className={fieldClass}
              placeholder='npr. "Grow"'
            />
          </div>
          <div>
            <label className={labelClass}>Cena (EUR)</label>
            <input
              type="number"
              value={form.packagePrice}
              onChange={e => update('packagePrice', e.target.value)}
              className={fieldClass}
              placeholder="250"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-[#FF4D4D] text-[13px] bg-[#FF4D4D]/8 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || clients.length === 0}
        className="portal-btn portal-btn-primary w-full sm:w-auto h-11"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          'Kreiraj projekat'
        )}
      </button>
    </form>
  );
}
