// Google Analytics & Facebook Pixel Helper Functions

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

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
 * Track Facebook Pixel Event
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
 * ⭐ GLAVNI LEAD EVENT - Uspešno poslata kontakt forma
 */
export const trackLeadGeneration = (
  source: 'contact_page' | 'home_page',
  userName: string,
  language: string
) => {
  // Google Analytics
  trackEvent('generate_lead', {
    event_category: 'Lead Generation',
    event_label: `${source === 'contact_page' ? 'Contact Form' : 'Home Contact Form'} - Success`,
    value: 1,
    currency: 'EUR',
    lead_source: source,
    language: language,
    user_name: userName
  });

  // Facebook Pixel
  trackFBEvent('Lead', {
    content_name: `${source === 'contact_page' ? 'Contact' : 'Home'} Form Submission`,
    content_category: 'Lead Generation',
    value: 1,
    currency: 'EUR'
  });

  console.log('✅ Lead tracked:', { source, userName, language });
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
  trackEvent('cta_click', {
    event_category: 'Engagement',
    event_label: buttonLabel,
    location: location,
    language: language
  });
};

/**
 * Track Portfolio Project Click
 */
export const trackPortfolioClick = (
  projectName: string,
  projectUrl: string,
  language: string
) => {
  trackEvent('portfolio_click', {
    event_category: 'Engagement',
    event_label: projectName,
    project_url: projectUrl,
    language: language
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
 * Track Video Play
 */
export const trackVideoPlay = (
  videoTitle: string,
  videoId: string,
  language: string
) => {
  trackEvent('video_play', {
    event_category: 'Engagement',
    event_label: videoTitle,
    video_id: videoId,
    language: language
  });
};

/**
 * 🎥 Track Video Gate - Kada korisnik otkljuca video
 */
export const trackVideoGate = (
  userName: string,
  userEmail: string,
  videoId: string,
  language: string
) => {
  // Google Analytics
  trackEvent('video_gate_unlock', {
    event_category: 'Lead Generation',
    event_label: 'Video Gate - User Unlocked Video',
    value: 1,
    currency: 'EUR',
    video_id: videoId,
    language: language,
    user_name: userName,
    user_email: userEmail
  });

  // Facebook Pixel
  trackFBEvent('Lead', {
    content_name: 'Video Gate Submission',
    content_category: 'Lead Generation - Video',
    value: 1,
    currency: 'EUR'
  });

  console.log('✅ Video gate tracked:', { userName, userEmail, videoId, language });
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
 * ⭐ Track Quiz Completion (sa email submit-om)
 */
export const trackQuizComplete = (
  userName: string,
  userEmail: string,
  answers: Record<number, string>,
  language: string
) => {
  // Google Analytics
  trackEvent('quiz_complete', {
    event_category: 'Lead Generation',
    event_label: 'Quiz Completed with Email',
    value: 1,
    currency: 'EUR',
    language: language,
    user_name: userName,
    user_email: userEmail,
    total_questions: Object.keys(answers).length
  });

  // Facebook Pixel
  trackFBEvent('Lead', {
    content_name: 'Quiz Completion',
    content_category: 'Lead Generation - Quiz',
    value: 1,
    currency: 'EUR'
  });

  console.log('✅ Quiz complete tracked:', { userName, userEmail, totalAnswers: Object.keys(answers).length, language });
};

/**
 * 📥 Track PDF Download Request (kada korisnik popuni formu za download)
 */
export const trackPDFDownloadRequest = (
  pdfType: 'guide' | 'checklist',
  userName: string,
  userEmail: string,
  language: string
) => {
  // Google Analytics
  trackEvent('pdf_download_request', {
    event_category: 'Lead Generation',
    event_label: `PDF Download - ${pdfType === 'guide' ? 'Vodic' : 'Checklist'}`,
    value: 1,
    currency: 'EUR',
    pdf_type: pdfType,
    language: language,
    user_name: userName,
    user_email: userEmail
  });

  // Facebook Pixel
  trackFBEvent('Lead', {
    content_name: `PDF Download - ${pdfType}`,
    content_category: 'Lead Generation - Resource',
    value: 1,
    currency: 'EUR'
  });

  console.log('✅ PDF download request tracked:', { pdfType, userName, userEmail, language });
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
 * 🔍 Track Audit Form Submission
 */
export const trackAuditFormSubmit = (
  userName: string,
  userEmail: string,
  websiteUrl: string,
  language: string
) => {
  // Google Analytics
  trackEvent('audit_form_submit', {
    event_category: 'Lead Generation',
    event_label: 'Audit Form Submitted',
    value: 1,
    currency: 'EUR',
    language: language,
    user_name: userName,
    user_email: userEmail,
    website_url: websiteUrl
  });

  // Facebook Pixel
  trackFBEvent('Lead', {
    content_name: 'Audit Form Submission',
    content_category: 'Lead Generation - Audit',
    value: 1,
    currency: 'EUR'
  });

  console.log('✅ Audit form tracked:', { userName, userEmail, websiteUrl, language });
};

