import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import type { ProjectStep } from '../../lib/types';

interface StepsTimelineProps {
  steps: ProjectStep[];
}

function StepDot({ step, index }: { step: ProjectStep; index: number }) {
  if (step.status === 'done') {
    return (
      <div className="w-[23px] h-[23px] rounded-full bg-[#e6f8f2] flex items-center justify-center shrink-0 mt-[1px]">
        <Check size={12} strokeWidth={2.5} color="#0faa6e" />
      </div>
    );
  }
  if (step.status === 'active') {
    return (
      <div className="w-[23px] h-[23px] rounded-full bg-[#e6f7fa] flex items-center justify-center shrink-0 mt-[1px]">
        <span className="text-[10px] font-semibold text-[#00bcd4]">{index + 1}</span>
      </div>
    );
  }
  return (
    <div className="w-[23px] h-[23px] rounded-full bg-[#f7f8fa] flex items-center justify-center shrink-0 mt-[1px]">
      <span className="text-[10px] font-medium text-[#9aa3b2]">{index + 1}</span>
    </div>
  );
}

export function StepsTimeline({ steps }: StepsTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="portal-card portal-animate-in" style={{ animationDelay: '0.05s' }}>
      <h3 className="text-[13px] font-medium text-[#1a2030] mb-[14px]">
        Koraci projekta
      </h3>

      <div className="space-y-0">
        {steps.map((step, idx) => {
          const isExpanded = expandedId === step.id;
          const isLast = idx === steps.length - 1;
          const isActive = step.status === 'active';

          return (
            <div key={step.id} className="relative flex gap-3">
              {/* Dot + connector */}
              <div className="flex flex-col items-center">
                <StepDot step={step} index={idx} />
                {!isLast && (
                  <div
                    className="w-[1px] flex-1 min-h-[20px]"
                    style={{ background: step.status === 'done' ? '#0faa6e' : '#e3e7ee' }}
                  />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-4'}`}>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : step.id)}
                  className={`w-full text-left rounded-lg px-2 py-1.5 -mx-2 -my-0.5 transition-all duration-150 ${
                    isActive ? 'bg-[#e6f7fa]/40' : 'hover:bg-[#f7f8fa]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[13px] ${
                      isActive ? 'text-[#00bcd4] font-medium' :
                      step.status === 'done' ? 'text-[#1a2030]' : 'text-[#9aa3b2]'
                    }`}>
                      {step.title}
                    </span>
                    <div className="flex items-center gap-2">
                      {step.estimated_date && (
                        <span className="text-[11px] text-[#9aa3b2] hidden sm:flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(step.estimated_date).toLocaleDateString('sr-Latn', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                      {step.description && (
                        isExpanded
                          ? <ChevronUp size={14} className="text-[#9aa3b2]" />
                          : <ChevronDown size={14} className="text-[#9aa3b2]" />
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && step.description && (
                  <div className="mt-1.5 px-2 text-[13px] text-[#1a2030] leading-relaxed portal-animate-in">
                    {step.description}
                  </div>
                )}

                {step.status === 'done' && step.completed_at && (
                  <p className="text-[11px] text-[#9aa3b2] mt-0.5 px-2">
                    Završeno {new Date(step.completed_at).toLocaleDateString('sr-Latn')}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
