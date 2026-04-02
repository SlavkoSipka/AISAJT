import { Rocket, ExternalLink } from 'lucide-react';
import type { ProjectDeploy } from '../../lib/types';

interface DeployFeedProps {
  deploys: ProjectDeploy[];
  maxItems?: number;
}

export function DeployFeed({ deploys, maxItems = 5 }: DeployFeedProps) {
  const visible = deploys.slice(0, maxItems);

  if (visible.length === 0) {
    return (
      <div className="portal-card portal-animate-in" style={{ animationDelay: '0.25s' }}>
        <h3 className="text-[13px] font-medium text-[#1a2030] mb-[14px]">
          Poslednje izmene
        </h3>
        <p className="text-[13px] text-[#9aa3b2] text-center py-4">
          Nema objavljenih izmena za sada.
        </p>
      </div>
    );
  }

  return (
    <div className="portal-card portal-animate-in" style={{ animationDelay: '0.25s' }}>
      <h3 className="text-[13px] font-medium text-[#1a2030] mb-[14px]">
        Poslednje izmene
      </h3>
      <div className="space-y-2.5">
        {visible.map(deploy => (
          <div
            key={deploy.id}
            className="flex gap-3 rounded-lg border-l-[3px] border-[#00bcd4] bg-[#f7f8fa] px-3 py-2.5"
          >
            <div className="w-7 h-7 rounded-full bg-[#e6f7fa] flex items-center justify-center shrink-0 mt-0.5">
              <Rocket size={13} className="text-[#00bcd4]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-[#1a2030] leading-snug">
                {deploy.admin_summary || 'Nova verzija sajta'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-[#9aa3b2]">
                  {new Date(deploy.deployed_at).toLocaleDateString('sr-Latn', {
                    day: 'numeric',
                    month: 'short',
                  })}
                  {' '}
                  {new Date(deploy.deployed_at).toLocaleTimeString('sr-Latn', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {deploy.deploy_url && (
                  <a
                    href={deploy.deploy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#00bcd4] hover:underline flex items-center gap-0.5"
                  >
                    Pogledaj
                    <ExternalLink size={9} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
