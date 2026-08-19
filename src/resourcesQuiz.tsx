import type { MetaFunction } from 'react-router';
import { QuizPage } from './components/pages/QuizPage';
import { buildPageMeta } from './utils/pageMeta';

export const meta: MetaFunction = () => buildPageMeta({
  title: 'Kviz - Pronađite Ideal website rešenje | AISajt',
  description: 'Odgovorite na nekoliko pitanja i otkrijte koje web rešenje najbolje odgovara vašim potrebama. Besplatna procena i konsultacije za izradu sajta.',
  keywords: 'web kviz, procena sajta, izrada sajta kviz, web development quiz, aisajt kviz',
  canonical: 'https://aisajt.com/resources/quiz',
});

export default function ResourcesQuizRoute() {
  return <QuizPage />;
}
