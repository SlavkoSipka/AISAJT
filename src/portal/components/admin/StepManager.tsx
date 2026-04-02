import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Check, ArrowRight, Circle, Plus, Loader2, Trash2, ListOrdered } from 'lucide-react';
import type { ProjectStep, StepStatus } from '../../lib/types';

interface StepManagerProps {
  steps: ProjectStep[];
  projectId: string;
  onUpdate: () => void;
}

function sortedSteps(steps: ProjectStep[]): ProjectStep[] {
  return [...steps].sort((a, b) => a.position - b.position);
}

export function StepManager({ steps, projectId, onUpdate }: StepManagerProps) {
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newInsertPosition, setNewInsertPosition] = useState(1);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const ordered = sortedSteps(steps);
  const maxSlot = Math.max(1, ordered.length + 1);

  useEffect(() => {
    setNewInsertPosition(prev => Math.min(Math.max(1, prev), ordered.length + 1));
  }, [ordered.length]);

  const handleStatusChange = async (step: ProjectStep, newStatus: StepStatus) => {
    setSavingId(step.id);
    try {
      if (newStatus === 'active') {
        await supabase
          .from('project_steps')
          .update({ status: 'pending' })
          .eq('project_id', projectId)
          .eq('status', 'active');

        await supabase
          .from('project_steps')
          .update({ status: 'done', completed_at: new Date().toISOString() })
          .eq('project_id', projectId)
          .lt('position', step.position)
          .neq('status', 'done');
      }

      await supabase
        .from('project_steps')
        .update({
          status: newStatus,
          completed_at: newStatus === 'done' ? new Date().toISOString() : null,
        })
        .eq('id', step.id);

      onUpdate();
    } finally {
      setSavingId(null);
    }
  };

  const handleUpdateField = async (stepId: string, field: string, value: string) => {
    await supabase
      .from('project_steps')
      .update({ [field]: value || null })
      .eq('id', stepId);
    onUpdate();
  };

  const renormalizePositions = async (remaining: ProjectStep[]) => {
    const sorted = sortedSteps(remaining);
    for (let i = 0; i < sorted.length; i++) {
      const want = i + 1;
      if (sorted[i].position !== want) {
        await supabase.from('project_steps').update({ position: want }).eq('id', sorted[i].id);
      }
    }
  };

  const handleDeleteStep = async (step: ProjectStep) => {
    if (!window.confirm(`Obrisati korak „${step.title}"?`)) return;
    setDeletingId(step.id);
    try {
      const remaining = ordered.filter(s => s.id !== step.id);
      await supabase.from('project_steps').delete().eq('id', step.id);
      await renormalizePositions(remaining);
      onUpdate();
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddStep = async () => {
    if (!newTitle.trim()) return;
    const insertAt = Math.min(Math.max(1, newInsertPosition), ordered.length + 1);
    setAdding(true);
    try {
      const toShift = ordered.filter(s => s.position >= insertAt).sort((a, b) => b.position - a.position);
      for (const s of toShift) {
        await supabase.from('project_steps').update({ position: s.position + 1 }).eq('id', s.id);
      }

      await supabase.from('project_steps').insert({
        project_id: projectId,
        position: insertAt,
        title: newTitle.trim(),
        description: newDesc.trim() || null,
        status: 'pending' as StepStatus,
      });

      setNewTitle('');
      setNewDesc('');
      setNewInsertPosition(ordered.length + 2);
      onUpdate();
    } finally {
      setAdding(false);
    }
  };

  const statusButtons: { value: StepStatus; icon: React.ReactNode; label: string; activeColor: string }[] = [
    { value: 'pending', icon: <Circle size={12} />, label: 'Čeka', activeColor: 'text-[#9aa3b2] bg-[#f7f8fa]' },
    { value: 'active', icon: <ArrowRight size={12} />, label: 'Aktivan', activeColor: 'text-[#00bcd4] bg-[#e6f7fa]' },
    { value: 'done', icon: <Check size={12} />, label: 'Gotovo', activeColor: 'text-[#0faa6e] bg-[#e6f8f2]' },
  ];

  return (
    <div>
      <h4 className="text-[13px] font-medium text-[#1a2030] mb-3">
        Koraci projekta
      </h4>

      <div className="space-y-2">
        {ordered.map((step, idx) => (
          <div
            key={step.id}
            className={`rounded-lg border px-3 py-2.5 transition-all duration-150 ${
              step.status === 'active'
                ? 'border-[#00bcd4]/20 bg-[#e6f7fa]/30'
                : 'border-[#e3e7ee] bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-[12px] text-[#9aa3b2] mt-1 font-medium w-5 shrink-0">
                {idx + 1}.
              </span>

              <div className="flex-1 min-w-0">
                <input
                  defaultValue={step.title}
                  onBlur={e => {
                    if (e.target.value !== step.title) handleUpdateField(step.id, 'title', e.target.value);
                  }}
                  className="bg-transparent text-[13px] text-[#1a2030] font-medium w-full outline-none focus:text-[#00bcd4] transition-colors"
                />
                <input
                  defaultValue={step.description || ''}
                  placeholder="Opis koraka..."
                  onBlur={e => {
                    if (e.target.value !== (step.description || '')) handleUpdateField(step.id, 'description', e.target.value);
                  }}
                  className="bg-transparent text-[12px] text-[#5a6478] w-full outline-none mt-0.5"
                />
                <input
                  type="date"
                  defaultValue={step.estimated_date || ''}
                  onBlur={e => {
                    if (e.target.value !== (step.estimated_date || '')) handleUpdateField(step.id, 'estimated_date', e.target.value);
                  }}
                  className="bg-transparent text-[11px] text-[#9aa3b2] outline-none mt-1"
                />
              </div>

              <div className="flex items-center gap-0.5 shrink-0">
                {savingId === step.id ? (
                  <Loader2 size={14} className="text-[#00bcd4] animate-spin" />
                ) : (
                  statusButtons.map(btn => (
                    <button
                      key={btn.value}
                      type="button"
                      onClick={() => {
                        if (step.status !== btn.value) handleStatusChange(step, btn.value);
                      }}
                      title={btn.label}
                      className={`p-1.5 rounded-md transition-all duration-150 ${
                        step.status === btn.value
                          ? btn.activeColor
                          : 'text-[#9aa3b2] hover:text-[#5a6478]'
                      }`}
                    >
                      {btn.icon}
                    </button>
                  ))
                )}
                <button
                  type="button"
                  title="Obriši korak"
                  onClick={() => handleDeleteStep(step)}
                  disabled={deletingId === step.id}
                  className="p-1.5 rounded-md text-[#9aa3b2] hover:text-[#e53e3e] hover:bg-[#e53e3e]/8 transition-all ml-0.5 disabled:opacity-40"
                >
                  {deletingId === step.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add step */}
      <div className="mt-3 border border-dashed border-[#e3e7ee] rounded-lg p-3 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1 space-y-2">
            <div>
              <label className="flex items-center gap-1.5 text-[11px] text-[#9aa3b2] mb-1">
                <ListOrdered size={12} />
                Korak po redu (umetanje)
              </label>
              <select
                value={Math.min(newInsertPosition, maxSlot)}
                onChange={e => setNewInsertPosition(Number(e.target.value))}
                className="portal-input text-[13px] w-full sm:max-w-xs"
                disabled={adding}
              >
                {Array.from({ length: maxSlot }, (_, i) => i + 1).map(n => {
                  const atEnd = n === ordered.length + 1;
                  const beforeTitle = ordered[n - 1]?.title?.slice(0, 36) || '';
                  return (
                    <option key={n} value={n}>
                      {atEnd
                        ? `${n}. — na kraj liste`
                        : `${n}. — pre „${beforeTitle}${(ordered[n - 1]?.title?.length || 0) > 36 ? '…' : ''}"`}
                    </option>
                  );
                })}
              </select>
              <p className="text-[11px] text-[#9aa3b2] mt-1">
                Novi korak dobija ovaj redni broj; postojeći se pomeraju nadole.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Naslov novog koraka…"
                className="portal-input text-[13px] flex-1"
                disabled={adding}
              />
              <button
                type="button"
                onClick={handleAddStep}
                disabled={!newTitle.trim() || adding}
                className="portal-btn portal-btn-primary text-[12px] py-2 px-3 disabled:opacity-40 shrink-0"
              >
                <Plus size={14} />
                Dodaj
              </button>
            </div>
          </div>
        </div>
        <input
          value={newDesc}
          onChange={e => setNewDesc(e.target.value)}
          placeholder="Opis (opciono)…"
          className="portal-input text-[12px]"
          disabled={adding}
        />
      </div>
    </div>
  );
}
