import { useAuth } from '../../hooks/useAuth';

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const { profile } = useAuth();

  const initials = (profile?.full_name || '')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  return (
    <header className="h-[52px] border-b border-[#e3e7ee] bg-white flex items-center justify-between px-6 sticky top-0 z-30">
      <h2 className="text-[14px] font-medium text-[#1a2030] truncate">
        {title || 'Portal'}
      </h2>

      <div className="flex items-center gap-3">
        <span className="text-[12px] text-[#5a6478] hidden sm:block">
          {profile?.full_name || profile?.role}
        </span>
        <div className="w-[30px] h-[30px] rounded-full bg-[#e6f7fa] flex items-center justify-center">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              className="w-[30px] h-[30px] rounded-full object-cover" loading="lazy" />
          ) : (
            <span className="text-[11px] font-medium text-[#00bcd4]">{initials}</span>
          )}
        </div>
      </div>
    </header>
  );
}
