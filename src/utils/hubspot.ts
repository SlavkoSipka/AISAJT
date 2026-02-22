/**
 * HubSpot Forms API Integration
 * 
 * Portal ID: 147390341
 * Region: EU (eu1)
 */

const HUBSPOT_PORTAL_ID = '147390341';
const HUBSPOT_REGION = 'eu1';
const HUBSPOT_API_BASE = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}`;

// Form GUIDs
export const HUBSPOT_FORMS = {
  CONTACT: 'c231dc70-334c-4cff-9e82-a61e8c104778',
  QUIZ: 'dfa591a2-c7b2-4504-b6e9-45c8c2a34064',
  VIDEO_GATE: 'ff0f24a0-37ff-41af-a1c2-b89e77cceee9',
  PDF_GUIDE: '89843516-efd3-4c14-828f-d048259918bc',
  PDF_CHECKLIST: '8bb5c7bf-6285-44cb-8844-01a2f1ed3b56',
  AUDIT: '4f9b6dcf-8ae4-4662-99fc-e5fce8eca077',
  EXIT_AUDIT: '85d72683-6f07-4a24-a2d9-96884e4c65b4',
  EXIT_GUIDE: '152926e4-d2da-4781-9582-e19c08a7a6fb',
};

interface HubSpotField {
  name: string;
  value: string;
}

interface HubSpotSubmissionData {
  fields: HubSpotField[];
  context?: {
    pageUri?: string;
    pageName?: string;
    hutk?: string; // HubSpot user token from cookie
  };
}

/**
 * Submit form data to HubSpot
 */
export async function submitToHubSpot(
  formGuid: string,
  fields: Record<string, string>,
  pageName?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    // Prepare fields in HubSpot format
    const hubspotFields: HubSpotField[] = Object.entries(fields).map(([name, value]) => ({
      name,
      value: String(value),
    }));

    // Get HubSpot tracking cookie if available
    const hutk = getCookie('hubspotutk');

    // Prepare submission data
    const submissionData: HubSpotSubmissionData = {
      fields: hubspotFields,
      context: {
        pageUri: window.location.href,
        pageName: pageName || document.title,
        ...(hutk && { hutk }),
      },
    };

    // Submit to HubSpot
    const response = await fetch(`${HUBSPOT_API_BASE}/${formGuid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    });

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.status}`);
    }

    await response.json();

    return {
      success: true,
      message: 'Form submitted successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Submit contact form (ContactPage + Home Contact section)
 */
export async function submitContactForm(data: {
  name: string;
  email: string;
  phone: string;
}): Promise<{ success: boolean; message?: string }> {
  // Split name into firstname and lastname
  const nameParts = data.name.trim().split(' ');
  const firstname = nameParts[0] || '';
  const lastname = nameParts.slice(1).join(' ') || '';

  // HubSpot standard field names:
  // - firstname: First Name (Single-line text)
  // - lastname: Last Name (Single-line text)
  // - email: Email (Email field)
  // - phone: Phone Number (Phone number field)
  
  return submitToHubSpot(
    HUBSPOT_FORMS.CONTACT,
    {
      firstname: firstname,
      lastname: lastname,
      email: data.email,
      phone: data.phone,
    },
    'Contact Form'
  );
}

/**
 * Submit funnel booking form (FunnelPage) – isti HubSpot Contact form + budžet (message + budget)
 * Budžet šaljemo i kao "message" i kao "budget" da se prikaže u emailu ako imaš to polje u formi.
 */
export async function submitFunnelForm(data: {
  name: string;
  email: string;
  phone: string;
  message?: string; // budžet (opciono)
}): Promise<{ success: boolean; message?: string }> {
  const nameParts = data.name.trim().split(' ');
  const firstname = nameParts[0] || '';
  const lastname = nameParts.slice(1).join(' ') || '';

  const fields: Record<string, string> = {
    firstname,
    lastname,
    email: data.email,
    phone: data.phone,
  };
  if (data.message) {
    fields.message = data.message;
    fields.budget = data.message; // i kao "budget" da se prosledi u HubSpot i u email
  }

  return submitToHubSpot(
    HUBSPOT_FORMS.CONTACT,
    fields,
    'Funnel – Besplatna konsultacija'
  );
}

/**
 * Submit quiz form
 */
export async function submitQuizForm(data: {
  name: string;
  email: string;
  phone: string;
  answers: Record<number, string>; // { 0: 'landing', 1: '3-5-pages', ... }
}): Promise<{ success: boolean; message?: string }> {
  // Split name into firstname and lastname
  const nameParts = data.name.trim().split(' ');
  const firstname = nameParts[0] || '';
  const lastname = nameParts.slice(1).join(' ') || '';

  // Map quiz answers to HubSpot custom properties
  // answers[0] = quiz_website_goal
  // answers[1] = quiz_content_amount
  // answers[2] = quiz_update_frequency
  // answers[3] = quiz_budget
  
  const fields: Record<string, string> = {
    firstname: firstname,
    lastname: lastname,
    email: data.email,
    phone: data.phone,
  };

  // Add quiz answers (only if they exist)
  if (data.answers[0]) fields.quiz_website_goal = data.answers[0];
  if (data.answers[1]) fields.quiz_content_amount = data.answers[1];
  if (data.answers[2]) fields.quiz_update_frequency = data.answers[2];
  if (data.answers[3]) fields.quiz_budget = data.answers[3];

  return submitToHubSpot(
    HUBSPOT_FORMS.QUIZ,
    fields,
    'Quiz Form'
  );
}

/**
 * Submit video gate form (simple: name + email)
 */
export async function submitVideoGateForm(data: {
  name: string;
  email: string;
}): Promise<{ success: boolean; message?: string }> {
  // Split name into firstname and lastname
  const nameParts = data.name.trim().split(' ');
  const firstname = nameParts[0] || '';
  const lastname = nameParts.slice(1).join(' ') || '';

  return submitToHubSpot(
    HUBSPOT_FORMS.VIDEO_GATE,
    {
      firstname: firstname,
      lastname: lastname,
      email: data.email,
    },
    'Video Gate'
  );
}

/**
 * Submit PDF download form (Guide or Checklist)
 */
export async function submitPDFDownloadForm(data: {
  name: string;
  email: string;
  type: 'guide' | 'checklist';
}): Promise<{ success: boolean; message?: string }> {
  // Split name into firstname and lastname
  const nameParts = data.name.trim().split(' ');
  const firstname = nameParts[0] || '';
  const lastname = nameParts.slice(1).join(' ') || '';

  // Choose form based on PDF type
  const formGuid = data.type === 'guide' 
    ? HUBSPOT_FORMS.PDF_GUIDE 
    : HUBSPOT_FORMS.PDF_CHECKLIST;

  return submitToHubSpot(
    formGuid,
    {
      firstname: firstname,
      lastname: lastname,
      email: data.email,
    },
    `PDF Download - ${data.type}`
  );
}

/**
 * Submit audit form
 */
export async function submitAuditForm(data: {
  name: string;
  email: string;
  website: string;
  phone?: string;
}): Promise<{ success: boolean; message?: string }> {
  // Split name into firstname and lastname
  const nameParts = data.name.trim().split(' ');
  const firstname = nameParts[0] || '';
  const lastname = nameParts.slice(1).join(' ') || '';

  const fields: Record<string, string> = {
    firstname: firstname,
    lastname: lastname,
    email: data.email,
    website: data.website,
  };

  // Add phone if provided
  if (data.phone) {
    fields.phone = data.phone;
  }

  return submitToHubSpot(
    HUBSPOT_FORMS.AUDIT,
    fields,
    'Audit Form'
  );
}

/**
 * Submit exit intent popup - audit (email + website)
 */
export async function submitExitAuditForm(data: {
  email: string;
  website: string;
}): Promise<{ success: boolean; message?: string }> {
  return submitToHubSpot(
    HUBSPOT_FORMS.EXIT_AUDIT,
    {
      email: data.email,
      website: data.website,
    },
    'Exit Intent - Audit'
  );
}

/**
 * Submit exit intent popup - guide (email only)
 */
export async function submitExitGuideForm(data: {
  email: string;
}): Promise<{ success: boolean; message?: string }> {
  return submitToHubSpot(
    HUBSPOT_FORMS.EXIT_GUIDE,
    {
      email: data.email,
    },
    'Exit Intent - Guide'
  );
}

/**
 * Get cookie value by name
 */
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

/**
 * Check if HubSpot is loaded and available
 */
export function isHubSpotLoaded(): boolean {
  return typeof window !== 'undefined' && 'hbspt' in window;
}

/**
 * Wait for HubSpot to load (max 5 seconds)
 */
export function waitForHubSpot(maxWaitTime = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    if (isHubSpotLoaded()) {
      resolve(true);
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isHubSpotLoaded()) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > maxWaitTime) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
}
