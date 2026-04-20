import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';
import { useFiles } from '../hooks/useFiles';
import { useDeploys } from '../hooks/useDeploys';
import { StepManager } from '../components/admin/StepManager';
import { MessageReply } from '../components/admin/MessageReply';
import { DeployManager } from '../components/admin/DeployManager';
import { FilesList } from '../components/client/FilesList';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ProgressBar } from '../components/shared/ProgressBar';
import { Topbar } from '../components/layout/Topbar';
import {
  Loader2,
  ArrowLeft,
  Globe,
  ExternalLink,
  User,
  KeyRound,
} from 'lucide-react';
import type { Project, ProjectStep, Profile } from '../lib/types';
import { readErrorFromResponse } from '../lib/http';
import { ensureHttpsUrl } from '../lib/url';
import '../portal.css';

export function AdminProject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile: adminProfile } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [client, setClient] = useState<Profile | null>(null);
  const [steps, setSteps] = useState<ProjectStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { messages, sendMessage } = useMessages(project?.client_id);
  const { files, uploading, uploadFile } = useFiles(project?.client_id);
  const { deploys, updateDeploy, deleteDeploy } = useDeploys(id);

  const fetchData = useCallback(async () => {
    if (!id) return;

    const [{ data: projData }, { data: stepsData }] = await Promise.all([
      supabase.from('projects').select('*').eq('id', id).single(),
      supabase.from('project_steps').select('*').eq('project_id', id).order('position'),
    ]);

    if (projData) {
      const proj = projData as Project;
      setProject(proj);
      setSteps((stepsData as ProjectStep[]) || []);

      const { data: clientData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', proj.client_id)
        .single();
      setClient(clientData as Profile | null);
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleProjectUpdate = async (field: string, value: string | number | null) => {
    if (!project) return;
    setSaving(true);
    await supabase
      .from('projects')
      .update({ [field]: value })
      .eq('id', project.id);
    await fetchData();
    setSaving(false);
  };

  const handleResetPassword = async () => {
    if (!client) return;
    try {
      const res = await fetch('/.netlify/functions/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: client.id }),
      });
      if (res.ok) {
        alert('Link za reset lozinke je poslat klijentu.');
      } else {
        alert(await readErrorFromResponse(res));
      }
    } catch {
      alert('Greška pri slanju linka.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-6 h-6 text-[#00bcd4] animate-spin" />
    </div>
  );

  if (!project) {
    return (
      <>
        <Topbar title="Projekat nije pronađen" />
        <main className="p-6 text-center text-[#1a2030]">
          Projekat sa ovim ID-jem ne postoji.
        </main>
      </>
    );
  }

  const progress = steps.length
    ? (steps.filter(s => s.status === 'done').length / steps.length) * 100
    : 0;

  return (
    <>
      <Topbar title={project.name} />
      <main className="px-6 py-5">
          <button
            onClick={() => navigate('/portal/admin')}
            className="flex items-center gap-1.5 text-[13px] text-[#5a6478] hover:text-[#1a2030] mb-4 transition-colors"
          >
            <ArrowLeft size={14} />
            Nazad na projekte
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Left column */}
            <div className="lg:col-span-3 space-y-5">
              <div className="portal-card portal-animate-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-medium text-[#1a2030]">
                    Informacije o projektu
                  </h3>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={project.status} />
                    {saving && <Loader2 size={14} className="text-[#00bcd4] animate-spin" />}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-[#9aa3b2] mb-1 block">Naziv</label>
                    <input
                      defaultValue={project.name}
                      onBlur={e => {
                        if (e.target.value !== project.name) handleProjectUpdate('name', e.target.value);
                      }}
                      className="portal-input text-[13px]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#9aa3b2] mb-1 block">Domen</label>
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-[#9aa3b2] shrink-0" />
                      <input
                        defaultValue={project.domain || ''}
                        onBlur={e => handleProjectUpdate('domain', e.target.value || null)}
                        className="portal-input text-[13px]"
                        placeholder="primerdomena.rs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-[#9aa3b2] mb-1 block">Preview URL</label>
                    <input
                      defaultValue={project.netlify_preview_url || ''}
                      onBlur={e => handleProjectUpdate('netlify_preview_url', e.target.value || null)}
                      className="portal-input text-[13px]"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#9aa3b2] mb-1 block">Status</label>
                    <select
                      defaultValue={project.status}
                      onChange={e => handleProjectUpdate('status', e.target.value)}
                      className="portal-input text-[13px]"
                    >
                      <option value="active">Aktivan</option>
                      <option value="paused">Pauziran</option>
                      <option value="completed">Završen</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-[#9aa3b2] mb-1 block">Paket</label>
                    <input
                      defaultValue={project.package_name || ''}
                      onBlur={e => handleProjectUpdate('package_name', e.target.value || null)}
                      className="portal-input text-[13px]"
                      placeholder="Grow"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#9aa3b2] mb-1 block">Cena (EUR)</label>
                    <input
                      type="number"
                      defaultValue={project.package_price || ''}
                      onBlur={e => handleProjectUpdate('package_price', e.target.value ? Number(e.target.value) : null)}
                      className="portal-input text-[13px]"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <ProgressBar percentage={progress} />
                </div>

                {project.netlify_preview_url && (
                  <a
                    href={ensureHttpsUrl(project.netlify_preview_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[12px] text-[#00bcd4] hover:underline mt-3"
                  >
                    <ExternalLink size={12} />
                    Otvori preview
                  </a>
                )}
              </div>

              <div className="portal-card portal-animate-in" style={{ animationDelay: '0.05s' }}>
                <StepManager
                  steps={steps}
                  projectId={project.id}
                  onUpdate={fetchData}
                />
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-2 space-y-5">
              <div className="portal-card portal-animate-in" style={{ animationDelay: '0.1s' }}>
                <MessageReply
                  messages={messages}
                  currentUserId={adminProfile?.id || ''}
                  onSend={sendMessage}
                />
              </div>

              <div className="portal-card portal-animate-in" style={{ animationDelay: '0.15s' }}>
                <h4 className="text-[13px] font-medium text-[#1a2030] mb-3">
                  Fajlovi
                </h4>
                <FilesList
                  files={files}
                  uploading={uploading}
                  onUpload={uploadFile}
                  compact
                />
              </div>

              <div className="portal-card portal-animate-in" style={{ animationDelay: '0.2s' }}>
                <DeployManager
                  deploys={deploys}
                  onUpdate={updateDeploy}
                  onDelete={deleteDeploy}
                />
              </div>

              {client && (
                <div className="portal-card portal-animate-in" style={{ animationDelay: '0.25s' }}>
                  <h4 className="text-[13px] font-medium text-[#1a2030] mb-3">
                    Klijent
                  </h4>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#e6f7fa] flex items-center justify-center">
                      <User size={16} className="text-[#00bcd4]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#1a2030]">{client.full_name}</p>
                      <p className="text-[11px] text-[#9aa3b2]">{client.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleResetPassword}
                    className="portal-btn portal-btn-secondary text-[12px] w-full"
                  >
                    <KeyRound size={14} />
                    Resetuj lozinku
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
    </>
  );
}
