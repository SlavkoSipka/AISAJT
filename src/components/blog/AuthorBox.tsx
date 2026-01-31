import { useLanguage } from '../../hooks/useLanguage';

interface AuthorBoxProps {
  author: {
    name: string;
    image: string;
  };
  publishedAt: string;
  updatedAt: string;
}

export function AuthorBox({ author, publishedAt, updatedAt }: AuthorBoxProps) {
  const { language } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'sr' ? 'sr-RS' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-200 mb-8">
      <img 
        src={author.image} 
        alt={author.name}
        className="w-12 h-12 md:w-14 md:h-14 rounded-full object-contain border-2 border-violet-300 bg-white p-1"
      />
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
          <span className="text-xs sm:text-sm text-gray-600 font-semibold">
            {language === 'sr' ? 'Autor:' : 'Author:'}
          </span>
          <span className="text-sm sm:text-base text-gray-900 font-bold">{author.name}</span>
        </div>
        <div className="text-xs sm:text-sm text-gray-600">
          <div>
            <span className="font-semibold">
              {language === 'sr' ? 'Objavljeno:' : 'Published:'}
            </span>{' '}
            {formatDate(publishedAt)}
          </div>
          {publishedAt !== updatedAt && (
            <div className="mt-1">
              <span className="font-semibold text-violet-600">
                {language === 'sr' ? '🔄 Ažurirano:' : '🔄 Updated:'}
              </span>{' '}
              {formatDate(updatedAt)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

