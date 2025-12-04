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
  
  console.log(`🎯 Navigation called: sectionId="${sectionId}", currentPath="${currentPath}"`);

  if (isOnHomePage) {
    // Already on homepage - just scroll to section with smooth animation
    console.log('✅ Already on homepage, scrolling directly');
    scrollToSection(sectionId);
  } else {
    // Navigate to homepage first
    console.log('🏠 Navigating to homepage first...');
    navigate('/');
    
    // Wait for navigation and retry until element is found
    scrollWithRetry(sectionId, 0);
  }
};

const scrollWithRetry = (sectionId: string, attempt: number) => {
  const maxAttempts = 10;
  const retryDelay = 200; // Check every 200ms
  
  console.log(`⏱️ Attempt ${attempt + 1}/${maxAttempts} to find section "${sectionId}"`);
  
  const element = document.getElementById(sectionId);
  
  if (element) {
    console.log(`✅ Element found on attempt ${attempt + 1}! Scrolling now...`);
    scrollToSection(sectionId);
  } else if (attempt < maxAttempts) {
    console.log(`⏳ Element not found yet, retrying in ${retryDelay}ms...`);
    setTimeout(() => {
      scrollWithRetry(sectionId, attempt + 1);
    }, retryDelay);
  } else {
    console.error(`❌ Failed to find section "${sectionId}" after ${maxAttempts} attempts`);
  }
};

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  
  console.log(`🔍 Looking for section with id="${sectionId}"`);
  
  if (element) {
    console.log(`✅ Found element:`, element);
    const headerOffset = 100; // Offset for fixed navbar
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    console.log(`📏 Scrolling to position: ${offsetPosition}px`);

    // Smooth scroll animation
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  } else {
    console.error(`❌ Section with id "${sectionId}" NOT FOUND!`);
    console.log('Available sections:', document.querySelectorAll('[id]'));
  }
};

