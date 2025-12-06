// 🎯 MASTER ANALYTICS FILE - Meta Pixel & Google Ads Tracking
// Integrisano praćenje za Facebook Ads i Google Ads sa prioritetima

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

/**
 * 📊 PRIORITY LEVELS (za vrednost konverzija):
 * 
 * 🏆 TIER 1 (Vrednost: 15€) - GLAVNI LEADOVI:
 *    - Contact Form Submit → Thank You page
 *    - Quiz Complete sa emailom
 *    - Audit Form Submit
 * 
 * 🥈 TIER 2 (Vrednost: 5€) - SREDNJI LEADOVI:
 *    - Video Gate Unlock (email za video)
 *    - PDF Download (email za resources)
 * 
 * 🥉 TIER 3 (Vrednost: 0) - ENGAGEMENT EVENTI:
 *    - CTA klikovi
 *    - Portfolio klikovi
 *    - Video play
 *    - Scroll depth
 */

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
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': `AW-XXXXXXXXXX/${conversionLabel}`, // 👈 Ti ćeš zameniti sa tvojim ID-om
      'value': value || 0,
      'currency': 'EUR'
    });
  }
};

/**
 * 🏆 TIER 1 - GLAVNI LEAD EVENT - Uspešno poslata kontakt forma
 * Vrednost: 15€ (najviši prioritet)
 */
export const trackLeadGeneration = (
  source: 'contact_page' | 'home_page',
  userName: string,
  language: string
) => {
  const leadValue = 15; // Najviši prioritet

  // 1️⃣ Google Analytics 4 - Event
  trackEvent('generate_lead', {
    event_category: 'Lead Generation',
    event_label: `${source === 'contact_page' ? 'Contact Form' : 'Home Contact Form'} - Success`,
    value: leadValue,
    currency: 'EUR',
    lead_source: source,
    language: language,
    user_name: userName
  });

  // 2️⃣ Meta Pixel (Facebook Ads) - Standard Event
  trackFBEvent('Lead', {
    content_name: `${source === 'contact_page' ? 'Contact' : 'Home'} Form Submission`,
    content_category: 'Lead Generation - Tier 1',
    value: leadValue,
    currency: 'EUR',
    status: 'success'
  });

  // 3️⃣ Google Ads Conversion Tracking
  trackGoogleAdsConversion('contact_form_submit', leadValue);

  console.log('🏆 TIER 1 Lead tracked:', { source, userName, language, value: leadValue });
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
 * 🥉 TIER 3 - ENGAGEMENT - CTA Button Click
 * Vrednost: 0€ (engagement tracking za retargeting)
 */
export const trackCTAClick = (
  buttonLabel: string,
  location: string,
  language: string
) => {
  // 1️⃣ Google Analytics 4 - Event
  trackEvent('cta_click', {
    event_category: 'Engagement',
    event_label: buttonLabel,
    location: location,
    language: language
  });

  // 2️⃣ Meta Pixel - Custom Event (za Custom Audiences)
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'CTAClick', {
      button_label: buttonLabel,
      location: location,
      language: language
    });
  }

  console.log('🥉 TIER 3 CTA Click tracked:', { buttonLabel, location, language });
};

/**
 * 🥉 TIER 3 - ENGAGEMENT - Portfolio Project Click
 * Vrednost: 0€ (visok engagement signal za retargeting)
 */
export const trackPortfolioClick = (
  projectName: string,
  projectUrl: string,
  language: string
) => {
  // 1️⃣ Google Analytics 4 - Event
  trackEvent('portfolio_click', {
    event_category: 'Engagement',
    event_label: projectName,
    project_url: projectUrl,
    language: language
  });

  // 2️⃣ Meta Pixel - ViewContent (standardni event za engagement)
  trackFBEvent('ViewContent', {
    content_name: projectName,
    content_category: 'Portfolio',
    content_type: 'project',
    content_ids: [projectUrl]
  });

  console.log('🥉 TIER 3 Portfolio Click tracked:', { projectName, projectUrl, language });
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
 * 🥉 TIER 3 - ENGAGEMENT - Scroll Depth
 * Prati kada korisnik skroluje 25%, 50%, 75%, 90% stranice
 */
export const trackScrollDepth = (
  percentage: 25 | 50 | 75 | 90,
  pagePath: string,
  language: string
) => {
  // 1️⃣ Google Analytics 4 - Event
  trackEvent('scroll_depth', {
    event_category: 'Engagement',
    event_label: `Scrolled ${percentage}%`,
    percent_scrolled: percentage,
    page_path: pagePath,
    language: language
  });

  // 2️⃣ Meta Pixel - Custom Event za duboko engažovane korisnike (75%+)
  if (percentage >= 75 && typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'HighEngagement', {
      engagement_type: 'scroll_depth',
      scroll_percentage: percentage,
      page_path: pagePath
    });
  }

  console.log(`🥉 TIER 3 Scroll ${percentage}% tracked:`, { pagePath, language });
};

/**
 * 🥉 TIER 3 - ENGAGEMENT - Time on Page
 * Prati kada korisnik provede određeno vreme na stranici
 */
export const trackTimeOnPage = (
  seconds: number,
  pagePath: string,
  language: string
) => {
  // 1️⃣ Google Analytics 4 - Event
  trackEvent('time_on_page', {
    event_category: 'Engagement',
    event_label: `Spent ${seconds}s on page`,
    time_seconds: seconds,
    page_path: pagePath,
    language: language
  });

  // 2️⃣ Meta Pixel - Custom Event za kvalitetne posetioce (120s+ = 2min+)
  if (seconds >= 120 && typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'HighEngagement', {
      engagement_type: 'time_on_page',
      time_seconds: seconds,
      page_path: pagePath
    });
  }

  console.log(`🥉 TIER 3 Time on Page ${seconds}s tracked:`, { pagePath, language });
};

/**
 * 🥉 TIER 3 - ENGAGEMENT - Page View with Meta Pixel
 * Prati page view za retargeting
 */
export const trackPageView = (
  pagePath: string,
  pageTitle: string,
  language: string
) => {
  // 1️⃣ Google Analytics 4 - Automatski prati page view
  
  // 2️⃣ Meta Pixel - PageView (već se poziva u index.html, ali može i programatski)
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }

  console.log('📄 Page View tracked:', { pagePath, pageTitle, language });
};

/**
 * 🥉 TIER 3 - ENGAGEMENT - Video Play
 * Vrednost: 0€ (jak engagement signal za retargeting)
 */
export const trackVideoPlay = (
  videoTitle: string,
  videoId: string,
  language: string
) => {
  // 1️⃣ Google Analytics 4 - Event
  trackEvent('video_play', {
    event_category: 'Engagement',
    event_label: videoTitle,
    video_id: videoId,
    language: language
  });

  // 2️⃣ Meta Pixel - Custom Event za video engagement
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'VideoPlay', {
      video_title: videoTitle,
      video_id: videoId,
      language: language
    });
  }

  console.log('🥉 TIER 3 Video Play tracked:', { videoTitle, videoId, language });
};

/**
 * 🥈 TIER 2 - SREDNJI LEAD - Video Gate Unlock
 * Vrednost: 5€ (srednji prioritet)
 */
export const trackVideoGate = (
  userName: string,
  userEmail: string,
  videoId: string,
  language: string
) => {
  const leadValue = 5; // Srednji prioritet

  // 1️⃣ Google Analytics 4 - Event
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

  // 2️⃣ Meta Pixel (Facebook Ads) - Standard Event
  trackFBEvent('Lead', {
    content_name: 'Video Gate Submission',
    content_category: 'Lead Generation - Tier 2',
    value: leadValue,
    currency: 'EUR',
    content_type: 'video'
  });

  // 3️⃣ Google Ads Conversion Tracking
  trackGoogleAdsConversion('video_unlock', leadValue);

  console.log('🥈 TIER 2 Video Lead tracked:', { userName, userEmail, videoId, language, value: leadValue });
};

/**
 * 📝 Track Quiz Start
 */
export const trackQuizStart = (language: string) => {
  trackEvent('quiz_start', {
    event_category: 'Lead Generation',
    event_label: 'Quiz Started',
    language: language
  });

  console.log('✅ Quiz start tracked:', { language });
};

/**
 * 📝 Track Quiz Question Answered
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
 * 🏆 TIER 1 - GLAVNI LEAD - Quiz Completion (sa email submit-om)
 * Vrednost: 15€ (najviši prioritet)
 */
export const trackQuizComplete = (
  userName: string,
  userEmail: string,
  answers: Record<number, string>,
  language: string
) => {
  const leadValue = 15; // Najviši prioritet

  // 1️⃣ Google Analytics 4 - Event
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

  // 2️⃣ Meta Pixel (Facebook Ads) - Standard Event
  trackFBEvent('Lead', {
    content_name: 'Quiz Completion',
    content_category: 'Lead Generation - Tier 1',
    value: leadValue,
    currency: 'EUR',
    status: 'completed'
  });

  // 3️⃣ Google Ads Conversion Tracking
  trackGoogleAdsConversion('quiz_complete', leadValue);

  console.log('🏆 TIER 1 Quiz Lead tracked:', { userName, userEmail, totalAnswers: Object.keys(answers).length, language, value: leadValue });
};

/**
 * 🥈 TIER 2 - SREDNJI LEAD - PDF Download Request
 * Vrednost: 5€ (srednji prioritet)
 */
export const trackPDFDownloadRequest = (
  pdfType: 'guide' | 'checklist',
  userName: string,
  userEmail: string,
  language: string
) => {
  const leadValue = 5; // Srednji prioritet

  // 1️⃣ Google Analytics 4 - Event
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

  // 2️⃣ Meta Pixel (Facebook Ads) - Standard Event
  trackFBEvent('Lead', {
    content_name: `PDF Download - ${pdfType}`,
    content_category: 'Lead Generation - Tier 2',
    value: leadValue,
    currency: 'EUR',
    content_type: 'document'
  });

  // 3️⃣ Google Ads Conversion Tracking
  trackGoogleAdsConversion('pdf_download', leadValue);

  console.log('🥈 TIER 2 PDF Lead tracked:', { pdfType, userName, userEmail, language, value: leadValue });
};

/**
 * 📥 Track Actual PDF Download (kada korisnik stvarno skine PDF)
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

  console.log('✅ PDF download tracked:', { pdfType, language });
};

/**
 * 🏆 TIER 1 - GLAVNI LEAD - Audit Form Submission
 * Vrednost: 15€ (najviši prioritet)
 */
export const trackAuditFormSubmit = (
  userName: string,
  userEmail: string,
  websiteUrl: string,
  language: string
) => {
  const leadValue = 15; // Najviši prioritet

  // 1️⃣ Google Analytics 4 - Event
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

  // 2️⃣ Meta Pixel (Facebook Ads) - Standard Event
  trackFBEvent('Lead', {
    content_name: 'Audit Form Submission',
    content_category: 'Lead Generation - Tier 1',
    value: leadValue,
    currency: 'EUR',
    status: 'submitted'
  });

  // 3️⃣ Google Ads Conversion Tracking
  trackGoogleAdsConversion('audit_form_submit', leadValue);

  console.log('🏆 TIER 1 Audit Lead tracked:', { userName, userEmail, websiteUrl, language, value: leadValue });
};

