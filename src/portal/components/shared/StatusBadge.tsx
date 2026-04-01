interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  active:    { bg: '#E8F6EF', text: '#22A06B', dot: '#22A06B', label: 'Aktivan' },
  paused:    { bg: '#FFF3E0', text: '#E8902A', dot: '#E8902A', label: 'Pauziran' },
  completed: { bg: '#EDE9FF', text: '#6B4FBB', dot: '#6B4FBB', label: 'Završen' },
  pending:   { bg: '#F0EDE7', text: '#9A9890', dot: '#9A9890', label: 'Na čekanju' },
  done:      { bg: '#E8F6EF', text: '#22A06B', dot: '#22A06B', label: 'Gotovo' },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const c = config[status] || config.pending;
  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-[12px] px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClass}`}
      style={{ background: c.bg, color: c.text }}
    >
      <span className="w-[6px] h-[6px] rounded-full" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}
