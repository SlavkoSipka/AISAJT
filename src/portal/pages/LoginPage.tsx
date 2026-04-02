import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import '../portal.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { session } = await signIn(email, password);
      if (!session?.user) throw new Error('Neuspešna prijava');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError?.code === 'PGRST116' || !profile) {
        setError(
          'Nalog postoji u Authentication, ali nema profila u bazi. U Supabase: Table Editor → profiles dodaj red gde id = isti UUID kao u Authentication → Users, role = admin.'
        );
        await supabase.auth.signOut();
        return;
      }

      if (profile.role === 'admin') {
        navigate('/portal/admin', { replace: true });
      } else {
        navigate('/portal/dashboard', { replace: true });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Greška pri prijavi';
      if (message.includes('Invalid login')) {
        setError('Pogrešan email ili lozinka');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f0f2f5', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="w-full max-w-[420px]" style={{ animation: 'portal-fade-in 0.4s ease forwards' }}>
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <h1 className="text-[24px] font-semibold text-[#1a2030] tracking-[-0.5px] mb-1">
            Klijentski portal
          </h1>
          <p className="text-[#5a6478] text-[13px]">
            Prijavite se da pratite napredak vašeg projekta
          </p>
        </div>

        {/* Card */}
        <div style={{ background: '#FFFFFF', border: '0.5px solid #e3e7ee', borderRadius: 12, padding: '28px 24px' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[12px] text-[#5a6478] font-medium mb-1.5">
                Email adresa
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-[13px] text-[#1a2030] rounded-lg outline-none transition-colors"
                style={{ background: '#f7f8fa', border: '0.5px solid #e3e7ee' }}
                onFocus={e => (e.target.style.borderColor = '#00bcd4')}
                onBlur={e => (e.target.style.borderColor = '#e3e7ee')}
                placeholder="vas@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-[12px] text-[#5a6478] font-medium mb-1.5">
                Lozinka
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 text-[13px] text-[#1a2030] rounded-lg outline-none transition-colors"
                  style={{ background: '#f7f8fa', border: '0.5px solid #e3e7ee' }}
                  onFocus={e => (e.target.style.borderColor = '#00bcd4')}
                  onBlur={e => (e.target.style.borderColor = '#e3e7ee')}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa3b2] hover:text-[#5a6478] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-[13px] rounded-lg px-3 py-2.5" style={{ color: '#e53e3e', background: 'rgba(229,62,62,0.06)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg text-[13px] font-semibold text-white flex items-center justify-center transition-colors disabled:opacity-50"
              style={{ background: '#00bcd4' }}
              onMouseEnter={e => { if (!loading) (e.target as HTMLElement).style.background = '#0097a7'; }}
              onMouseLeave={e => (e.target as HTMLElement).style.background = '#00bcd4'}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Prijavite se'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[#9aa3b2] text-[12px] mt-6 leading-relaxed">
          Nalog kreira vaš projektni menadžer.
          <br />
          Kontaktirajte nas ako imate problem sa prijavom.
        </p>
      </div>
    </div>
  );
}
