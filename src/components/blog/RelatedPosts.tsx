import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '../../types/blog';
import { useLanguage } from '../../hooks/useLanguage';

interface RelatedPostsProps {
  posts: BlogPost[];
  pillarPage?: {
    url: string;
    title: string;
    titleEn: string;
  };
}

export function RelatedPosts({ posts, pillarPage }: RelatedPostsProps) {
  const { language } = useLanguage();

  if (posts.length === 0 && !pillarPage) return null;

  return (
    <div className="mt-8 md:mt-16 border-t border-gray-200 pt-8 md:pt-16">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
        {language === 'sr' ? '📚 Preporučeni Sledeći Koraci' : '📚 Recommended Next Steps'}
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
        {/* Pillar Page (Money Page) - First */}
        {pillarPage && (
          <Link
            to={pillarPage.url}
            className="group bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 border-2 border-violet-300 hover:border-violet-500 transition-all duration-300 hover:shadow-xl"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                {language === 'sr' ? 'Usluga' : 'Service'}
              </span>
              <ArrowRight className="w-5 h-5 text-violet-600 transform group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors mb-2">
              {language === 'sr' ? pillarPage.title : pillarPage.titleEn}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'sr' 
                ? 'Pogledajte našu uslugu i cene' 
                : 'Check our service and pricing'}
            </p>
          </Link>
        )}

        {/* Related Blog Posts */}
        {posts.slice(0, pillarPage ? 2 : 3).map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-violet-300 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} {language === 'sr' ? 'min' : 'min'}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-violet-600 transition-colors mb-2 line-clamp-2">
              {language === 'sr' ? post.title : post.titleEn}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {language === 'sr' ? post.excerpt : post.excerptEn}
            </p>
            <div className="flex items-center text-violet-600 text-sm font-semibold group-hover:gap-2 transition-all">
              {language === 'sr' ? 'Pročitaj više' : 'Read more'}
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

