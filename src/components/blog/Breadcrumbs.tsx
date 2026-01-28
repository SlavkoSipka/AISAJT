import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface BreadcrumbItem {
  label: string;
  labelEn: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { language } = useLanguage();
  
  return (
    <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
      <ol className="flex items-center space-x-1.5 md:space-x-2 text-xs md:text-sm overflow-x-auto scrollbar-hide" itemScope itemType="https://schema.org/BreadcrumbList">
        {/* Home */}
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex-shrink-0">
          <Link 
            to="/" 
            itemProp="item"
            className="flex items-center text-gray-600 hover:text-violet-600 transition-colors"
          >
            <Home className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <meta itemProp="name" content="Home" />
          </Link>
          <meta itemProp="position" content="1" />
        </li>
        
        {items.map((item, index) => {
          // Za mobilni, NE prikazuj naziv članka (zadnji item)
          const isLastItem = index === items.length - 1;
          const shouldShowOnMobile = !isLastItem; // Prikaži sve osim naziva članka
          
          return (
            <li 
              key={index}
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
              className={`flex items-center flex-shrink-0 ${isLastItem ? 'hidden md:flex' : ''}`}
            >
              <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 mx-1 md:mx-2" />
              {item.path ? (
                <Link 
                  to={item.path}
                  itemProp="item"
                  className="text-gray-600 hover:text-violet-600 transition-colors whitespace-nowrap"
                >
                  <span itemProp="name">
                    {language === 'sr' ? item.label : item.labelEn}
                  </span>
                </Link>
              ) : (
                <span itemProp="name" className="text-gray-900 font-semibold">
                  {language === 'sr' ? item.label : item.labelEn}
                </span>
              )}
              <meta itemProp="position" content={String(index + 2)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

