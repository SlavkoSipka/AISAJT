interface FAQSchemaProps {
  items: Array<{ question: string; answer: string }>;
}

// Reusable FAQPage JSON-LD — raw <script>, not SEOHelmet's useEffect
// injection (confirmed in Phase 2 that never reaches prerendered HTML).
// Always build this from the same array the page renders as visible FAQ
// content, so schema and page can't drift apart.
export function FAQSchema({ items }: FAQSchemaProps) {
  if (items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
