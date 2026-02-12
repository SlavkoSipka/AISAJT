declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    _leadEventTracked?: boolean;
  }
}

const isLocalhost = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
};

/**
 * Track Google Analytics Event
 */
export const trackEvent = (
  eventName: string,
  params?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    currency?: string;
    [key: string]: any;
  }
) => {
  if (isLocalhost()) return;
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

/**
 * Track Facebook Pixel Event (Standard Events)
 */
export const trackFBEvent = (
  eventName: string,
  params?: {
    content_name?: string;
    content_category?: string;
    value?: number;
    currency?: string;
    [key: string]: any;
  }
) => {
  if (isLocalhost()) return;
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
};

/**
 * Track Google Ads Conversion
 */
export const trackGoogleAdsConversion = (
  conversionLabel: string,
  value?: number
) => {
  if (isLocalhost()) return;
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': `AW-XXXXXXXXXX/${conversionLabel}`,
      'value': value || 0,
      'currency': 'EUR'
    });
  }
};

const LEAD_DEDUPE_KEY = 'lead_tracked_at';
const LEAD_DEDUPE_MS = 5000;

/**
 * Track Lead Generation - Contact Form Submit
 */
export const trackLeadGeneration = (
  source: 'contact_page' | 'home_page',
  userName: string,
  language: string
) => {
  if (isLocalhost()) return;

  // Zaštita od duplog fire-a (double mount zbog loading screena / Strict Mode)
  if (window._leadEventTracked) return;
  const now = Date.now();
  const lastAt = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(LEAD_DEDUPE_KEY) : null;
  if (lastAt) {
    const elapsed = now - parseInt(lastAt, 10);
    if (elapsed < LEAD_DEDUPE_MS) return;
  }

  window._leadEventTracked = true;
  if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(LEAD_DEDUPE_KEY, String(now));
  setTimeout(() => {
    window._leadEventTracked = false;
  }, LEAD_DEDUPE_MS);

  const leadValue = 15; // Najviši prioritet

  // Google Analytics 4 - Event
  trackEvent('generate_lead', {
    event_category: 'Lead Generation',
    event_label: `${source === 'contact_page' ? 'Contact Form' : 'Home Contact Form'} - Success`,
    value: leadValue,
    currency: 'EUR',
    lead_source: source,
    language: language,
    user_name: userName
  });

  // Meta Pixel (Facebook Ads) - Standard Event
  trackFBEvent('Lead', {
    content_name: `${source === 'contact_page' ? 'Contact' : 'Home'} Form Submission`,
    content_category: 'Lead Generation - Tier 1',
    value: leadValue,
    currency: 'EUR',
    status: 'success'
  });

  // Google Ads Conversion Tracking
  trackGoogleAdsConversion('contact_form_submit', leadValue);
};

/**
 * Track Form Interaction (kada korisnik počne da popunjava formu)
 */
export const trackFormInteraction = (
  fieldName: string,
  formLocation: 'contact_page' | 'home_page',
  language: string
) => {
  trackEvent('form_interaction', {
    event_category: 'Lead Generation',
    event_label: `${formLocation === 'contact_page' ? 'Contact Form' : 'Home Contact Form'} - Started Filling ${fieldName}`,
    language: language
  });
};

/**
 * Track Form Submit Attempt
 */
export const trackFormSubmitAttempt = (
  formLocation: 'contact_page' | 'home_page',
  language: string
) => {
  trackEvent('form_submit_attempt', {
    event_category: 'Lead Generation',
    event_label: `${formLocation === 'contact_page' ? 'Contact Form' : 'Home Contact Form'} - Submit Clicked`,
    language: language,
    page_path: window.location.pathname
  });
};

/**
 * Track Form Error
 */
export const trackFormError = (
  formLocation: 'contact_page' | 'home_page',
  language: string,
  errorMessage: string
) => {
  trackEvent('form_submit_error', {
    event_category: 'Lead Generation',
    event_label: `${formLocation === 'contact_page' ? 'Contact Form' : 'Home Contact Form'} - Error`,
    language: language,
    error_message: errorMessage
  });
};

/**
 * Track CTA Button Click
 */
export const trackCTAClick = (
  buttonLabel: string,
  location: string,
  language: string
) => {
  if (isLocalhost()) return;
  
  // Google Analytics 4 - Event
  trackEvent('cta_click', {
    event_category: 'Engagement',
    event_label: buttonLabel,
    location: location,
    language: language
  });

  // Meta Pixel - Custom Event
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'CTAClick', {
      button_label: buttonLabel,
      location: location,
      language: language
    });
  }
};

/**
 * Track Portfolio Project Click
 */
export const trackPortfolioClick = (
  projectName: string,
  projectUrl: string,
  language: string
) => {
  // Google Analytics 4 - Event
  trackEvent('portfolio_click', {
    event_category: 'Engagement',
    event_label: projectName,
    project_url: projectUrl,
    language: language
  });

  // Meta Pixel - ViewContent
  trackFBEvent('ViewContent', {
    content_name: projectName,
    content_category: 'Portfolio',
    content_type: 'project',
    content_ids: [projectUrl]
  });
};

/**
 * Track Contact Info Click (email, phone)
 */
export const trackContactInfoClick = (
  contactType: 'email' | 'phone',
  value: string,
  language: string
) => {
  trackEvent('contact_info_click', {
    event_category: 'Engagement',
    event_label: `${contactType} - ${value}`,
    language: language
  });
};

/**
 * Track Navigation Click
 */
export const trackNavigationClick = (
  destination: string,
  language: string
) => {
  trackEvent('navigation_click', {
    event_category: 'Navigation',
    event_label: destination,
    language: language
  });
};

/**
 * Track Language Change
 */
export const trackLanguageChange = (
  from: string,
  to: string
) => {
  trackEvent('language_change', {
    event_category: 'User Preference',
    event_label: `${from} to ${to}`,
    from_language: from,
    to_language: to
  });
};

/**
 * Track Scroll Depth
 */
export const trackScrollDepth = (
  percentage: 25 | 50 | 75 | 90,
  pagePath: string,
  language: string
) => {
  if (isLocalhost()) return;
  
  // Google Analytics 4 - Event
  trackEvent('scroll_depth', {
    event_category: 'Engagement',
    event_label: `Scrolled ${percentage}%`,
    percent_scrolled: percentage,
    page_path: pagePath,
    language: language
  });

  // Meta Pixel - Custom Event for high engagement (75%+)
  if (percentage >= 75 && typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'HighEngagement', {
      engagement_type: 'scroll_depth',
      scroll_percentage: percentage,
      page_path: pagePath
    });
  }
};

/**
 * Track Time on Page
 */
export const trackTimeOnPage = (
  seconds: number,
  pagePath: string,
  language: string
) => {
  if (isLocalhost()) return;
  
  // Google Analytics 4 - Event
  trackEvent('time_on_page', {
    event_category: 'Engagement',
    event_label: `Spent ${seconds}s on page`,
    time_seconds: seconds,
    page_path: pagePath,
    language: language
  });

  // Meta Pixel - Custom Event for quality visitors (120s+)
  if (seconds >= 120 && typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'HighEngagement', {
      engagement_type: 'time_on_page',
      time_seconds: seconds,
      page_path: pagePath
    });
  }
};

/**
 * Track Page View with Meta Pixel
 */
export const trackPageView = (
  pagePath: string,
  pageTitle: string,
  language: string
) => {
  if (isLocalhost()) return;
  
  // Meta Pixel - PageView
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

/**
 * Track Video Play
 */
export const trackVideoPlay = (
  videoTitle: string,
  videoId: string,
  language: string
) => {
  if (isLocalhost()) return;
  
  // Google Analytics 4 - Event
  trackEvent('video_play', {
    event_category: 'Engagement',
    event_label: videoTitle,
    video_id: videoId,
    language: language
  });

  // Meta Pixel - Custom Event for video engagement
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'VideoPlay', {
      video_title: videoTitle,
      video_id: videoId,
      language: language
    });
  }
};

/**
 * Track Video Gate Unlock
 */
export const trackVideoGate = (
  userName: string,
  userEmail: string,
  videoId: string,
  language: string
) => {
  if (isLocalhost()) return;
  
  const leadValue = 5; // Srednji prioritet

  // Google Analytics 4 - Event
  trackEvent('video_gate_unlock', {
    event_category: 'Lead Generation',
    event_label: 'Video Gate - User Unlocked Video',
    value: leadValue,
    currency: 'EUR',
    video_id: videoId,
    language: language,
    user_name: userName,
    user_email: userEmail
  });

  // Meta Pixel (Facebook Ads) - Standard Event
  trackFBEvent('Lead', {
    content_name: 'Video Gate Submission',
    content_category: 'Lead Generation - Tier 2',
    value: leadValue,
    currency: 'EUR',
    content_type: 'video'
  });

  // Google Ads Conversion Tracking
  trackGoogleAdsConversion('video_unlock', leadValue);
};

/**
 * Track Quiz Start
 */
export const trackQuizStart = (language: string) => {
  trackEvent('quiz_start', {
    event_category: 'Lead Generation',
    event_label: 'Quiz Started',
    language: language
  });
};

/**
 * Track Quiz Question Answered
 */
export const trackQuizAnswer = (
  questionNumber: number,
  answer: string,
  language: string
) => {
  trackEvent('quiz_answer', {
    event_category: 'Lead Generation',
    event_label: `Quiz Question ${questionNumber} Answered`,
    question_number: questionNumber,
    answer: answer,
    language: language
  });
};

/**
 * Track Quiz Completion
 */
export const trackQuizComplete = (
  userName: string,
  userEmail: string,
  answers: Record<number, string>,
  language: string
) => {
  if (isLocalhost()) return;
  
  const leadValue = 15; // Najviši prioritet

  // Google Analytics 4 - Event
  trackEvent('quiz_complete', {
    event_category: 'Lead Generation',
    event_label: 'Quiz Completed with Email',
    value: leadValue,
    currency: 'EUR',
    language: language,
    user_name: userName,
    user_email: userEmail,
    total_questions: Object.keys(answers).length
  });

  // Meta Pixel (Facebook Ads) - Standard Event
  trackFBEvent('Lead', {
    content_name: 'Quiz Completion',
    content_category: 'Lead Generation - Tier 1',
    value: leadValue,
    currency: 'EUR',
    status: 'completed'
  });

  // Google Ads Conversion Tracking
  trackGoogleAdsConversion('quiz_complete', leadValue);
};

/**
 * Track PDF Download Request
 */
export const trackPDFDownloadRequest = (
  pdfType: 'guide' | 'checklist',
  userName: string,
  userEmail: string,
  language: string
) => {
  if (isLocalhost()) return;
  
  const leadValue = 5; // Srednji prioritet

  // Google Analytics 4 - Event
  trackEvent('pdf_download_request', {
    event_category: 'Lead Generation',
    event_label: `PDF Download - ${pdfType === 'guide' ? 'Vodic' : 'Checklist'}`,
    value: leadValue,
    currency: 'EUR',
    pdf_type: pdfType,
    language: language,
    user_name: userName,
    user_email: userEmail
  });

  // Meta Pixel (Facebook Ads) - Standard Event
  trackFBEvent('Lead', {
    content_name: `PDF Download - ${pdfType}`,
    content_category: 'Lead Generation - Tier 2',
    value: leadValue,
    currency: 'EUR',
    content_type: 'document'
  });

  // Google Ads Conversion Tracking
  trackGoogleAdsConversion('pdf_download', leadValue);
};

/**
 * Track Actual PDF Download
 */
export const trackPDFDownload = (
  pdfType: 'guide' | 'checklist',
  language: string
) => {
  trackEvent('pdf_download', {
    event_category: 'Engagement',
    event_label: `PDF Downloaded - ${pdfType === 'guide' ? 'Vodic' : 'Checklist'}`,
    pdf_type: pdfType,
    language: language
  });
};

/**
 * Track Audit Form Submission
 */
export const trackAuditFormSubmit = (
  userName: string,
  userEmail: string,
  websiteUrl: string,
  language: string
) => {
  if (isLocalhost()) return;
  
  const leadValue = 15; // Najviši prioritet

  // Google Analytics 4 - Event
  trackEvent('audit_form_submit', {
    event_category: 'Lead Generation',
    event_label: 'Audit Form Submitted',
    value: leadValue,
    currency: 'EUR',
    language: language,
    user_name: userName,
    user_email: userEmail,
    website_url: websiteUrl
  });

  // Meta Pixel (Facebook Ads) - Standard Event
  trackFBEvent('Lead', {
    content_name: 'Audit Form Submission',
    content_category: 'Lead Generation - Tier 1',
    value: leadValue,
    currency: 'EUR',
    status: 'submitted'
  });

  // Google Ads Conversion Tracking
  trackGoogleAdsConversion('audit_form_submit', leadValue);
};

