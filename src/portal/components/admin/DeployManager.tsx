import { useState } from 'react';
import { Rocket, Eye, EyeOff, Trash2, Loader2, ExternalLink } from 'lucide-react';
import type { ProjectDeploy } from '../../lib/types';

interface DeployManagerProps {
  deploys: ProjectDeploy[];
  onUpdate: (id: string, fields: Partial<ProjectDeploy>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function DeployManager({ deploys, onUpdate, onDelete }: DeployManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [summaryDraft, setSummaryDraft] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const startEditing = (deploy: ProjectDeploy) => {
    setEditingId(deploy.id);
    setSummaryDraft(deploy.admin_summary || '');
  };

  const saveSummary = async (deploy: ProjectDeploy) => {
    setSavingId(deploy.id);
    await onUpdate(deploy.id, { admin_summary: summaryDraft.trim() || null });
    setEditingId(null);
    setSummaryDraft('');
    setSavingId(null);
  };

  const toggleVisibility = async (deploy: ProjectDeploy) => {
    setSavingId(deploy.id);
    await onUpdate(deploy.id, { is_visible: !deploy.is_visible });
    setSavingId(null);
  };

  const handleDelete = async (deploy: ProjectDeploy) => {
    if (!window.confirm('Obrisati ovaj deploy unos?')) return;
    setDeletingId(deploy.id);
    await onDelete(deploy.id);
    setDeletingId(null);
  };

  return (
    <div>
      <h4 className="text-[13px] font-medium text-[#1A1916] mb-3 flex items-center gap-2">
        <Rocket size={14} className="text-[#6B4FBB]" />
        Deploy-i ({deploys.length})
      </h4>

      {deploys.length === 0 ? (
        <p className="text-[13px] text-[#9A9890] text-center py-4">
          Nema deploy zapisa. Webhook ce ih automatski kreirati.
        </p>
      ) : (
        <div className="space-y-2">
          {deploys.map(deploy => {
            const isEditing = editingId === deploy.id;

            return (
              <div
                key={deploy.id}
                className={`rounded-lg border px-3 py-2.5 transition-all ${
                  deploy.is_visible
                    ? 'border-[#22A06B]/20 bg-[#E8F6EF]/30'
                    : 'border-[#E0DDD6] bg-[#F7F6F3]'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    {/* Date + deploy ID */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] text-[#9A9890]">
                        {new Date(deploy.deployed_at).toLocaleDateString('sr-Latn', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                        {' '}
                        {new Date(deploy.deployed_at).toLocaleTimeString('sr-Latn', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {deploy.is_visible && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E8F6EF] text-[#22A06B] font-medium">
                          Vidljiv
                        </span>
                      )}
                      {deploy.deploy_url && (
                        <a
                          href={deploy.deploy_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[#6B4FBB] hover:underline flex items-center gap-0.5"
                        >
                          <ExternalLink size={9} />
                        </a>
                      )}
                    </div>

                    {/* Commit message hint */}
                    {deploy.commit_message && (
                      <p className="text-[11px] text-[#B8B5AE] mb-1 truncate">
                        Commit: {deploy.commit_message}
                      </p>
                    )}

                    {/* Admin summary */}
                    {isEditing ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          value={summaryDraft}
                          onChange={e => setSummaryDraft(e.target.value)}
                          placeholder="Npr: Dodat kontakt formular, popravljen footer..."
                          className="portal-input text-[12px] flex-1"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveSummary(deploy);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                        />
                        <button
                          onClick={() => saveSummary(deploy)}
                          disabled={savingId === deploy.id}
                          className="portal-btn portal-btn-primary text-[11px] py-1.5 px-2.5 shrink-0"
                        >
                          {savingId === deploy.id ? <Loader2 size={12} className="animate-spin" /> : 'Sačuvaj'}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(deploy)}
                        className="text-[12px] mt-0.5 text-left w-full"
                      >
                        {deploy.admin_summary ? (
                          <span className="text-[#1A1916]">{deploy.admin_summary}</span>
                        ) : (
                          <span className="text-[#B8B5AE] italic">+ Dodaj opis za klijenta...</span>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 shrink-0 mt-0.5">
                    {savingId === deploy.id && !isEditing ? (
                      <Loader2 size={14} className="text-[#6B4FBB] animate-spin" />
                    ) : (
                      <>
                        <button
                          type="button"
                          title={deploy.is_visible ? 'Sakrij od klijenta' : 'Objavi klijentu'}
                          onClick={() => toggleVisibility(deploy)}
                          className={`p-1.5 rounded-md transition-all ${
                            deploy.is_visible
                              ? 'text-[#22A06B] bg-[#E8F6EF] hover:bg-[#22A06B]/15'
                              : 'text-[#B8B5AE] hover:text-[#6B4FBB] hover:bg-[#EDE9FF]'
                          }`}
                        >
                          {deploy.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <button
                          type="button"
                          title="Obriši"
                          onClick={() => handleDelete(deploy)}
                          disabled={deletingId === deploy.id}
                          className="p-1.5 rounded-md text-[#B8B5AE] hover:text-[#FF4D4D] hover:bg-[#FF4D4D]/8 transition-all disabled:opacity-40"
                        >
                          {deletingId === deploy.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
