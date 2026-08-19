import type { MetaFunction } from 'react-router';
import { WebShopPage } from './components/pages/WebShopPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'Izrada Web Shopa | Online Prodavnica Beograd, Novi Sad, Srbija',
  description: 'Profesionalna izrada web shopa u Beogradu, Novom Sadu i Srbiji — WooCommerce ili Shopify, cena od 499€. Besplatna konsultacija za vašu online prodavnicu.',
  keywords: 'izrada web shopa, izrada web shopa cena, izrada sajta za online prodaju, cena izrada web prodavnice, izrada internet prodavnice, izrada web shopa beograd',
  canonical: 'https://aisajt.com/izrada-web-shopa',
});

export const handle = { breadcrumb: 'Izrada Web Shopa' };

export default function IzradaWebShopaRoute() {
  return <WebShopPage />;
}
