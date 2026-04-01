import { ProgressBar } from '../shared/ProgressBar';
import { Calendar, AlertTriangle } from 'lucide-react';
import type { Project } from '../../lib/types';

interface ProjectHeaderProps {
  project: Project;
  progressPercentage: number;
  estimatedCompletion?: string | null;
}

function isNearDeadline(dateStr: string): boolean {
  const diff = new Date(dateStr).getTime() - Date.now();
  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
}

export function ProjectHeader({ project, progressPercentage, estimatedCompletion }: ProjectHeaderProps) {
  const near = estimatedCompletion ? isNearDeadline(estimatedCompletion) : false;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Progress card */}
      <div className="portal-card portal-animate-in">
        <p className="text-[11px] text-[#9A9890] mb-1">Napredak projekta</p>
        <p className="text-[22px] font-semibold text-[#1A1916] tracking-[-0.5px] mb-2">
          {Math.round(progressPercentage)}%
        </p>
        <ProgressBar percentage={progressPercentage} showLabel={false} height={5} />
      </div>

      {/* Deadline card */}
      <div className="portal-card portal-animate-in" style={{ animationDelay: '0.05s' }}>
        <p className="text-[11px] text-[#9A9890] mb-1">Procenjeno završavanje</p>
        {estimatedCompletion ? (
          <>
            <p className="text-[22px] font-semibold text-[#1A1916] tracking-[-0.5px]">
              {new Date(estimatedCompletion).toLocaleDateString('sr-Latn', { day: 'numeric', month: 'short' })}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              {near ? (
                <>
                  <AlertTriangle size={12} className="text-[#E8902A]" />
                  <span className="text-[12px] text-[#E8902A]">Približava se rok</span>
                </>
              ) : (
                <>
                  <Calendar size={12} className="text-[#9A9890]" />
                  <span className="text-[12px] text-[#9A9890]">
                    {new Date(estimatedCompletion).toLocaleDateString('sr-Latn', { year: 'numeric' })}
                  </span>
                </>
              )}
            </div>
          </>
        ) : (
          <p className="text-[14px] text-[#9A9890] mt-1">Nije definisano</p>
        )}
      </div>

      {/* Preview card — handled in parent or 3rd metric */}
      <div className="portal-card portal-animate-in flex flex-col justify-center" style={{ animationDelay: '0.1s' }}>
        <p className="text-[11px] text-[#9A9890] mb-1">Projekat</p>
        <p className="text-[16px] font-semibold text-[#1A1916] tracking-[-0.3px] truncate">{project.name}</p>
        {project.domain && (
          <p className="text-[12px] text-[#9A9890] mt-0.5 truncate">{project.domain}</p>
        )}
      </div>
    </div>
  );
}
