interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  active:    { bg: '#e6f8f2', text: '#0faa6e', dot: '#0faa6e', label: 'Aktivan' },
  paused:    { bg: '#fef6e4', text: '#e8970a', dot: '#e8970a', label: 'Pauziran' },
  completed: { bg: '#e6f7fa', text: '#00bcd4', dot: '#00bcd4', label: 'Završen' },
  pending:   { bg: '#f7f8fa', text: '#9aa3b2', dot: '#9aa3b2', label: 'Na čekanju' },
  done:      { bg: '#e6f8f2', text: '#0faa6e', dot: '#0faa6e', label: 'Gotovo' },
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
