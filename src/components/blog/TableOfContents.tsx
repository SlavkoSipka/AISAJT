import { useEffect, useState } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const { language } = useLanguage();
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66%' }
    );

    items.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu after clicking
      setIsOpen(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <>
      {/* Mobile TOC - Collapsible */}
      <div className="md:hidden mb-8 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-6 border border-violet-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between text-gray-900 font-bold text-lg"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-violet-600" />
            <span>{language === 'sr' ? 'Sadržaj' : 'Table of Contents'}</span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-[500px] mt-4' : 'max-h-0'
          }`}
        >
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} style={{ marginLeft: `${(item.level - 2) * 16}px` }}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left text-sm transition-colors hover:text-violet-600 ${
                    activeId === item.id
                      ? 'text-violet-600 font-semibold'
                      : 'text-gray-700'
                  }`}
                >
                  {item.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Desktop TOC - Sticky */}
      <div className="hidden md:block sticky top-24 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-6 border border-violet-200">
        <div className="flex items-center gap-2 mb-4">
          <List className="w-5 h-5 text-violet-600" />
          <h2 className="text-gray-900 font-bold text-lg">
            {language === 'sr' ? 'Sadržaj' : 'Table of Contents'}
          </h2>
        </div>
        <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {items.map((item) => (
            <li key={item.id} style={{ marginLeft: `${(item.level - 2) * 16}px` }}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={`text-left text-sm transition-colors hover:text-violet-600 ${
                  activeId === item.id
                    ? 'text-violet-600 font-semibold'
                    : 'text-gray-700'
                }`}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

