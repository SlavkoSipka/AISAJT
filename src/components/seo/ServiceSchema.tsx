import { SITE_URL } from '../../lib/site-config';
import { BUSINESS_ID } from './BusinessSchema';

interface ServiceSchemaProps {
  serviceType: string;
  description: string;
  path: string;
  /** Starting price in EUR — omit entirely if it isn't genuinely stated as visible on-page content. */
  startingPrice?: number;
}

// Reusable Service schema for the four service pages. `provider` references
// the sitewide business node by @id rather than repeating a disconnected
// stub, so the graph is properly linked instead of just adjacent.
export function ServiceSchema({ serviceType, description, path, startingPrice }: ServiceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType,
    description,
    url: `${SITE_URL}${path}`,
    provider: { '@id': BUSINESS_ID },
    areaServed: [
      { '@type': 'City', name: 'Beograd' },
      { '@type': 'Country', name: 'Srbija' },
    ],
    ...(startingPrice !== undefined && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          priceCurrency: 'EUR',
          minPrice: startingPrice,
        },
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
