import { useEffect, useState } from 'react';

/* Miš vs. prst. Kursorske animacije, hover-arming i slične fore imaju smisla
   samo na uređaju sa preciznim pokazivačem — na telefonu samo troše frejmove
   i kvare odziv na dodir. `(hover: hover) and (pointer: fine)` je jedini
   pouzdan test: `ontouchstart` je tačan i na touch laptopovima, a User-Agent
   sniffing greši na tabletima. */
const QUERY = '(hover: hover) and (pointer: fine)';

/**
 * true = miš/trackpad, false = dodir.
 *
 * Stranice se serveruju kroz SSR, gde matchMedia ne postoji. Zato prvi render
 * — i na serveru i pri hidrataciji — uvek vraća false, pa se prava vrednost
 * upiše tek u effect-u. Da se čita odmah u useState inicijalizatoru, desktop
 * bi na prvom klijentskom renderu dao drugačiji DOM od serverskog i srušio
 * hidrataciju. Praktična posledica je da se kursorski kvadratić na desktopu
 * pojavi jedan frejm kasnije; na dodiru se ne pojavi nikad, što i jeste cilj.
 */
export function usePointerFine(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(QUERY);
    const onChange = () => setFine(mq.matches);
    onChange();
    /* Safari < 14 nema addEventListener na MediaQueryList. */
    if (mq.addEventListener) {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  return fine;
}
