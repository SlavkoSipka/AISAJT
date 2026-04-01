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
    <header className="h-[52px] border-b border-[#E0DDD6] bg-white flex items-center justify-between px-6 sticky top-0 z-30">
      <h2 className="text-[14px] font-medium text-[#1A1916] truncate">
        {title || 'Portal'}
      </h2>

      <div className="flex items-center gap-3">
        <span className="text-[12px] text-[#7A7870] hidden sm:block">
          {profile?.full_name || profile?.role}
        </span>
        <div className="w-[30px] h-[30px] rounded-full bg-[#EDE9FF] flex items-center justify-center">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              className="w-[30px] h-[30px] rounded-full object-cover"
            />
          ) : (
            <span className="text-[11px] font-medium text-[#6B4FBB]">{initials}</span>
          )}
        </div>
      </div>
    </header>
  );
}
