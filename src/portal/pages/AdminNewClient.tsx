import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { readErrorFromResponse } from '../lib/http';
import { Loader2, UserPlus, Copy, Check, ArrowLeft } from 'lucide-react';
import '../portal.css';

const MIN_PASSWORD_LENGTH = 8;

interface CreatedClient {
  email: string;
  userId: string;
}

export function AdminNewClient() {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<CreatedClient | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Lozinka mora imati najmanje ${MIN_PASSWORD_LENGTH} karaktera.`);
      return;
    }
    if (password !== passwordConfirm) {
      setError('Lozinke se ne poklapaju.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/.netlify/functions/create-only-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          password,
        }),
      });

      if (!res.ok) {
        throw new Error(await readErrorFromResponse(res));
      }

      const data = await res.json() as { userId: string; email: string };
      setCreated({ email: data.email, userId: data.userId });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Nepoznata greška');
    } finally {
      setLoading(false);
    }
  };

  const copyEmail = async () => {
    if (!created) return;
    await navigator.clipboard.writeText(created.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="portal-root">
      <Sidebar />
      <div className="md:ml-[220px] min-h-screen pb-20 md:pb-0">
        <Topbar title="Novi klijent" />
        <main className="px-6 py-5">
          <Link
            to="/portal/admin/klijenti"
            className="flex items-center gap-1.5 text-[13px] text-[#7A7870] hover:text-[#1A1916] mb-5 transition-colors w-fit"
          >
            <ArrowLeft size={14} />
            Nazad na klijente
          </Link>

          {!created ? (
            <div className="max-w-md">
              <div className="portal-card portal-animate-in">
                <h3 className="text-[14px] font-medium text-[#1A1916] mb-1 flex items-center gap-2">
                  <UserPlus size={16} className="text-[#6B4FBB]" />
                  Dodaj novog klijenta
                </h3>
                <p className="text-[12px] text-[#9A9890] mb-5">
                  Postavite lozinku koju će klijent koristiti za prijavu.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] text-[#9A9890] font-medium mb-1.5">
                      Ime i prezime *
                    </label>
                    <input
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      className="portal-input"
                      placeholder="npr. Marko Marković"
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#9A9890] font-medium mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={e => setClientEmail(e.target.value)}
                      className="portal-input"
                      placeholder="marko@firma.rs"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#9A9890] font-medium mb-1.5">
                      Lozinka * (min. {MIN_PASSWORD_LENGTH} karaktera)
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="portal-input"
                      placeholder="••••••••"
                      required
                      minLength={MIN_PASSWORD_LENGTH}
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#9A9890] font-medium mb-1.5">
                      Potvrdi lozinku *
                    </label>
                    <input
                      type="password"
                      value={passwordConfirm}
                      onChange={e => setPasswordConfirm(e.target.value)}
                      className="portal-input"
                      placeholder="Ponovi lozinku"
                      required
                      minLength={MIN_PASSWORD_LENGTH}
                      autoComplete="new-password"
                    />
                  </div>

                  {error && (
                    <div className="text-[#FF4D4D] text-[13px] bg-[#FF4D4D]/8 rounded-lg px-3 py-2">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="portal-btn portal-btn-primary w-full h-11"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Kreiraj klijenta'}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="max-w-md portal-animate-in">
              <div className="portal-card" style={{ borderColor: '#22A06B40' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#E8F6EF] flex items-center justify-center shrink-0">
                    <Check size={18} className="text-[#22A06B]" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-medium text-[#1A1916]">
                      Klijent je kreiran!
                    </h3>
                    <p className="text-[12px] text-[#9A9890]">
                      Klijent se prijavljuje sa emailom ispod i lozinkom koju ste postavili.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-[#F7F6F3] border border-[#E0DDD6] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-[#9A9890] mb-0.5">Email za prijavu</p>
                      <p className="text-[13px] font-medium text-[#1A1916]">{created.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={copyEmail}
                      className="text-[#9A9890] hover:text-[#6B4FBB] transition-colors p-1.5 rounded"
                      title="Kopiraj email"
                    >
                      {copiedEmail ? <Check size={14} className="text-[#22A06B]" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <Link
                    to="/portal/admin/projekti/novi"
                    state={{ clientId: created.userId, clientName: clientName }}
                    className="portal-btn portal-btn-primary flex-1 text-[13px]"
                  >
                    Dodaj projekat ovom klijentu
                  </Link>
                  <Link
                    to="/portal/admin/klijenti"
                    className="portal-btn portal-btn-secondary flex-1 text-[13px]"
                  >
                    Lista klijenata
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
