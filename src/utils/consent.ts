export const CONSENT_STORAGE_KEY = 'aisajt_cookie_consent';

export type ConsentChoice = 'accepted' | 'rejected';

export function getStoredConsent(): ConsentChoice | null {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === 'accepted' || value === 'rejected' ? value : null;
  } catch {
    return null;
  }
}

export function storeConsent(choice: ConsentChoice): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Storage unavailable (private mode, blocked cookies) — consent choice
    // won't persist across reloads, but rejecting still prevents trackers
    // from loading in this session since we never call the loaders.
  }
}
