import { useRef, useState } from 'react';
import { Upload, FileText, Image, File, Loader2 } from 'lucide-react';
import type { ProjectFile } from '../../lib/types';

interface FilesListProps {
  files: ProjectFile[];
  uploading: boolean;
  onUpload: (file: File) => Promise<void>;
  compact?: boolean;
}

const fileIcons: Record<string, React.ReactNode> = {
  image: <Image size={16} className="text-[#6B4FBB]" />,
  pdf: <FileText size={16} className="text-[#FF4D4D]" />,
  document: <File size={16} className="text-[#E8902A]" />,
};

export function FilesList({ files, uploading, onUpload, compact }: FilesListProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) await onUpload(file);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await onUpload(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const displayFiles = compact ? files.slice(0, 5) : files;

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-150 ${
          dragOver
            ? 'border-[#6B4FBB] bg-[#EDE9FF]/30'
            : 'border-[#E0DDD6] hover:border-[#B8B5AE]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
        />
        {uploading ? (
          <Loader2 className="w-5 h-5 text-[#6B4FBB] animate-spin mx-auto" />
        ) : (
          <>
            <Upload size={20} className="text-[#9A9890] mx-auto mb-2" />
            <p className="text-[13px] text-[#3D3C38]">
              Prevucite fajl ovde ili <span className="text-[#6B4FBB]">kliknite</span>
            </p>
          </>
        )}
      </div>

      {displayFiles.length > 0 && (
        <div className="mt-4 space-y-1.5">
          {displayFiles.map(file => (
            <a
              key={file.id}
              href={file.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#F7F6F3] hover:bg-[#F0EDE7] border border-[#F0EDE7] transition-all duration-150"
            >
              {fileIcons[file.file_type || 'document']}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#1A1916] truncate">{file.file_name}</p>
                <p className="text-[11px] text-[#B8B5AE]">
                  {file.uploader?.full_name || 'Nepoznat'} &middot;{' '}
                  {new Date(file.created_at).toLocaleDateString('sr-Latn')}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}

      {files.length === 0 && !uploading && (
        <p className="text-[13px] text-[#9A9890] text-center py-4 mt-2">
          Nema otpremljenih fajlova.
        </p>
      )}
    </div>
  );
}
