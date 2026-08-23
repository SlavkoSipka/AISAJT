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

/** Ruta koja nosi formu za zakazivanje (nekadašnji /funnel). */
export const BOOKING_PATH = '/izrada-sajta-detalji';
export const BOOKING_SECTION_ID = 'booking-form';

/**
 * Vodi korisnika na formu za zakazivanje i skroluje do nje.
 * Ako smo već na toj stranici, samo skroluje; inače navigira pa skroluje
 * kada se sekcija pojavi u DOM-u.
 */
export const navigateToBooking = (
  navigate: (path: string) => void,
  currentPath: string
) => navigateToDetaljiSection(BOOKING_SECTION_ID, navigate, currentPath);

/** Skrol do bilo koje sekcije na /izrada-sajta-detalji (booking, portfolio...). */
export const navigateToDetaljiSection = (
  sectionId: string,
  navigate: (path: string) => void,
  currentPath: string
) => {
  if (currentPath === BOOKING_PATH) {
    scrollToSection(sectionId);
  } else {
    navigate(`${BOOKING_PATH}#${sectionId}`);
  }
};
