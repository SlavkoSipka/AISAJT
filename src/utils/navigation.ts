/**
 * Navigation helper for scrolling to sections
 * Works from any page - navigates to homepage if needed, then scrolls to section
 */

export const navigateToSection = (
  sectionId: string,
  navigate: (path: string) => void,
  currentPath: string
) => {
  const isOnHomePage = currentPath === '/';

  if (isOnHomePage) {
    scrollToSection(sectionId);
  } else {
    navigate('/');
    scrollWithRetry(sectionId, 0);
  }
};

const scrollWithRetry = (sectionId: string, attempt: number) => {
  const maxAttempts = 10;
  const retryDelay = 200;
  
  const element = document.getElementById(sectionId);
  
  if (element) {
    scrollToSection(sectionId);
  } else if (attempt < maxAttempts) {
    setTimeout(() => {
      scrollWithRetry(sectionId, attempt + 1);
    }, retryDelay);
  }
};

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  
  if (element) {
    const headerOffset = 0;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

