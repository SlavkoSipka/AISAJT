interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  height?: number;
}

export function ProgressBar({ percentage, showLabel = true, height = 5 }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[12px] text-[#9A9890]">Napredak</span>
          <span className="text-[12px] font-semibold text-[#6B4FBB]">
            {Math.round(clamped)}%
          </span>
        </div>
      )}
      <div
        className="w-full rounded-[10px] overflow-hidden"
        style={{ height, background: '#F0EDE7' }}
      >
        <div
          className="rounded-[10px] transition-all duration-500 ease-out"
          style={{ width: `${clamped}%`, height, background: '#6B4FBB' }}
        />
      </div>
    </div>
  );
}
