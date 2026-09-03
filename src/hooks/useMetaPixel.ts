import { useEffect } from 'react';
import { loadPixel } from '../utils/metaPixel';

/**
 * Pali Meta Pixel na stranici koja ga koristi (samo /izrada-sajta-detalji).
 *
 * Dva ulaza, jer pristanak može stići pre ili tokom posete:
 *  - montiranje stranice — posetilac je već ranije prihvatio kolačiće,
 *  - 'aisajt:consent' — prihvatio ih je upravo sad, dok gleda ovu stranicu.
 *
 * Sam loader je idempotentan, pa dupli poziv ne pravi dupli PageView.
 */
export function useMetaPixel(): void {
  useEffect(() => {
    loadPixel();
    const onConsent = () => loadPixel();
    window.addEventListener('aisajt:consent', onConsent);
    return () => window.removeEventListener('aisajt:consent', onConsent);
  }, []);
}
