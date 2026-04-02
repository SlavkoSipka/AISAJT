import type { ProjectDeploy } from '../../lib/types';

const DAYS = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];

interface ActivityChartProps {
  deploys: ProjectDeploy[];
}

function getWeekBuckets(deploys: ProjectDeploy[]): number[] {
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() + mondayOffset);

  const buckets = [0, 0, 0, 0, 0, 0, 0];

  for (const d of deploys) {
    const dt = new Date(d.deployed_at);
    if (dt >= monday) {
      const idx = Math.floor((dt.getTime() - monday.getTime()) / (24 * 60 * 60 * 1000));
      if (idx >= 0 && idx < 7) {
        buckets[idx]++;
      }
    }
  }

  return buckets;
}

export function ActivityChart({ deploys }: ActivityChartProps) {
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;
  const buckets = getWeekBuckets(deploys);
  const max = Math.max(...buckets, 1);

  return (
    <div className="portal-card portal-animate-in" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-[13px] font-medium text-[#1a2030] mb-[14px]">
        Aktivnost ove nedelje
      </h3>
      <div className="flex items-end justify-between gap-2" style={{ height: 50 }}>
        {buckets.map((val, i) => {
          const h = max > 0 ? (val / max) * 50 : 0;
          const isCurrent = i === todayIdx;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className="w-full rounded-t-[3px] transition-all"
                style={{
                  height: Math.max(h, 2),
                  background: isCurrent ? '#00bcd4' : '#e6f7fa',
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1.5">
        {DAYS.map((d, i) => (
          <span key={d} className="flex-1 text-center text-[9px]" style={{ color: i === todayIdx ? '#00bcd4' : '#9aa3b2' }}>
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}
