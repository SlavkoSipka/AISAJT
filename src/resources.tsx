import type { MetaFunction } from 'react-router';
import { ResourcesPage } from './components/pages/ResourcesPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'Resursi za Web Development | Vodič, Kviz, Audit | AISajt',
  description: 'Besplatni resursi za web development: Vodič za izradu sajta, kviz za procenu potreba, besplatan audit sajta. Sve što vam treba za uspešan web projekat.',
  keywords: 'web resursi, vodič za sajt, audit sajta, web kviz, besplatni resursi, aisajt resursi',
  canonical: 'https://aisajt.com/resources',
});

export default function ResourcesRoute() {
  return <ResourcesPage />;
}
