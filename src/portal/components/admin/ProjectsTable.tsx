import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../shared/StatusBadge';
import { ProgressBar } from '../shared/ProgressBar';
import { ChevronUp, ChevronDown, MessageSquare } from 'lucide-react';
import type { ProjectWithClient } from '../../lib/types';

interface ProjectsTableProps {
  projects: ProjectWithClient[];
}

type SortKey = 'name' | 'status' | 'progress' | 'unread';
type SortDir = 'asc' | 'desc';

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...projects].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    switch (sortKey) {
      case 'name':
        return a.name.localeCompare(b.name) * dir;
      case 'status':
        return a.status.localeCompare(b.status) * dir;
      case 'progress': {
        const pa = a.steps.length ? a.steps.filter(s => s.status === 'done').length / a.steps.length : 0;
        const pb = b.steps.length ? b.steps.filter(s => s.status === 'done').length / b.steps.length : 0;
        return (pa - pb) * dir;
      }
      case 'unread':
        return ((a.unread_count || 0) - (b.unread_count || 0)) * dir;
      default:
        return 0;
    }
  });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="inline ml-0.5" />
      : <ChevronDown size={12} className="inline ml-0.5" />;
  };

  const headerClass = 'text-[11px] text-[#9A9890] font-medium cursor-pointer hover:text-[#7A7870] transition-colors select-none';

  return (
    <div className="portal-card overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-[#E0DDD6]">
            <th className={`text-left py-3 px-4 ${headerClass}`} onClick={() => toggleSort('name')}>
              Klijent / Projekat <SortIcon col="name" />
            </th>
            <th className={`text-left py-3 px-4 ${headerClass}`}>Domen</th>
            <th className={`text-left py-3 px-4 ${headerClass}`} onClick={() => toggleSort('status')}>
              Status <SortIcon col="status" />
            </th>
            <th className={`text-left py-3 px-4 ${headerClass}`}>Trenutni korak</th>
            <th className={`text-left py-3 px-4 ${headerClass} w-[140px]`} onClick={() => toggleSort('progress')}>
              Napredak <SortIcon col="progress" />
            </th>
            <th className={`text-center py-3 px-4 ${headerClass}`} onClick={() => toggleSort('unread')}>
              Poruke <SortIcon col="unread" />
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(project => {
            const progress = project.steps.length
              ? (project.steps.filter(s => s.status === 'done').length / project.steps.length) * 100
              : 0;
            const activeStep = project.steps.find(s => s.status === 'active');

            return (
              <tr
                key={project.id}
                onClick={() => navigate(`/portal/admin/projekti/${project.id}`)}
                className="border-b border-[#F0EDE7] hover:bg-[#F7F6F3] cursor-pointer transition-colors"
              >
                <td className="py-3 px-4">
                  <p className="text-[13px] font-medium text-[#1A1916]">{project.name}</p>
                  <p className="text-[12px] text-[#9A9890]">{project.client?.full_name}</p>
                </td>
                <td className="py-3 px-4">
                  <span className="text-[13px] text-[#3D3C38]">{project.domain || '—'}</span>
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={project.status} />
                </td>
                <td className="py-3 px-4">
                  <span className="text-[13px] text-[#3D3C38]">
                    {activeStep ? activeStep.title : '—'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <ProgressBar percentage={progress} showLabel={false} height={4} />
                </td>
                <td className="py-3 px-4 text-center">
                  {(project.unread_count || 0) > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] bg-[#FF4D4D]/10 text-[#FF4D4D] px-2 py-0.5 rounded-full font-medium">
                      <MessageSquare size={10} />
                      {project.unread_count}
                    </span>
                  ) : (
                    <span className="text-[12px] text-[#B8B5AE]">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {sorted.length === 0 && (
        <p className="text-[13px] text-[#9A9890] text-center py-12">
          Nema projekata. Kreirajte prvi!
        </p>
      )}
    </div>
  );
}
