import { ThankYouPage } from './components/pages/ThankYouPage';

// No meta() export — ThankYouPage never had its own SEOHelmet call before
// this migration either, so it inherits root.tsx's default meta, exactly
// matching pre-migration behavior (not a scope decision to add/omit noindex).
export default function ThankYouRoute() {
  return <ThankYouPage />;
}
