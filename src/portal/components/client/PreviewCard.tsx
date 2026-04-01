import { ExternalLink, Globe } from 'lucide-react';
import { ensureHttpsUrl } from '../../lib/url';

interface PreviewCardProps {
  previewUrl: string;
}

export function PreviewCard({ previewUrl }: PreviewCardProps) {
  const url = ensureHttpsUrl(previewUrl);
  const displayUrl = url.replace(/^https?:\/\//, '');

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="portal-card portal-animate-in flex items-center gap-4 hover:border-[#6B4FBB]/30 transition-all group"
      style={{ animationDelay: '0.1s' }}
    >
      <div className="w-10 h-10 rounded-lg bg-[#EDE9FF] flex items-center justify-center shrink-0 group-hover:bg-[#6B4FBB]/15 transition-colors">
        <Globe size={18} className="text-[#6B4FBB]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-[#9A9890] mb-0.5">Preview sajta</p>
        <p className="text-[13px] font-medium text-[#1A1916] group-hover:text-[#6B4FBB] transition-colors truncate">
          {displayUrl}
        </p>
      </div>
      <ExternalLink size={14} className="text-[#B8B5AE] group-hover:text-[#6B4FBB] transition-colors shrink-0" />
    </a>
  );
}
