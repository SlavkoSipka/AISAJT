import { useCallback, useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

/* ClipPlayer — 15s loop sa našeg domena se vrti u pozadini, pun klip živi na
   Vimeu i priprema se tek kad player uđe u vidno polje. Vimeo tako ne servira
   ništa posetiocima koji nikad ne skroluju do videa, a onima koji dođu do njega
   je player spreman pre nego što kliknu.

   Klik radi kroz Vimeo Player SDK (setCurrentTime + setVolume + play), pa klip
   kreće od nule sa zvukom bez reloada iframe-a. Stara varijanta je menjala
   iframe.src, zbog čega je video na unmute uvek krenuo ispočetka uz treptaj. */

type VimeoNs = { Player: new (el: HTMLIFrameElement) => VimeoPlayer };
type VimeoPlayer = {
  play: () => Promise<void>;
  setVolume: (v: number) => Promise<number>;
  setCurrentTime: (s: number) => Promise<number>;
  destroy: () => Promise<void>;
};

let sdkPromise: Promise<VimeoNs> | null = null;
let preconnected = false;

/** DNS + TLS ka Vimeo hostovima se otvara unapred, da klik ne ceka rukovanje. */
function preconnectVimeo() {
  if (preconnected || typeof document === 'undefined') return;
  preconnected = true;
  for (const href of [
    'https://player.vimeo.com',
    'https://f.vimeocdn.com',
    'https://i.vimeocdn.com',
    'https://fresnel.vimeocdn.com',
  ]) {
    const l = document.createElement('link');
    l.rel = 'preconnect';
    l.href = href;
    l.crossOrigin = '';
    document.head.appendChild(l);
  }
}

/** SDK (~30KB) se povlači tek kad se player približi ekranu — ne usporava prvi load. */
function loadVimeoSdk(): Promise<VimeoNs> {
  if (typeof window === 'undefined') return Promise.reject(new Error('SSR'));
  const w = window as unknown as { Vimeo?: VimeoNs };
  if (w.Vimeo?.Player) return Promise.resolve(w.Vimeo);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://player.vimeo.com/api/player.js';
    s.async = true;
    s.onload = () =>
      w.Vimeo?.Player ? resolve(w.Vimeo) : reject(new Error('Vimeo SDK nedostupan'));
    s.onerror = () => reject(new Error('Vimeo SDK blokiran'));
    document.head.appendChild(s);
  });
  return sdkPromise;
}

interface ClipPlayerProps {
  /** Vimeo ID punog klipa, npr. '1222709692'. */
  vimeoId: string;
  /** 15s nemi loop sa našeg domena, npr. '/videos/izrada-sajta-loop.mp4'. */
  loopSrc: string;
  /** Poster — prikazuje se dok se loop učitava i uz reduced-motion. */
  poster: string;
  title: string;
  headline: string;
  subline: string;
  /** Klase kruga sa play ikonicom — svaka stranica prosleđuje svoju paletu. */
  accentButton?: string;
  accentBadge?: string;
  className?: string;
}

export function ClipPlayer({
  vimeoId,
  loopSrc,
  poster,
  title,
  headline,
  subline,
  accentButton = 'bg-white/90',
  accentBadge = 'bg-black/60 border-white/10',
  className = '',
}: ClipPlayerProps) {
  /* armed = iframe je montiran i SDK se priprema (hover/tap, pre klika)
     playing = korisnik je kliknuo, pun klip preuzima ekran
     direct = SDK nije uspeo, pa autoplay guramo kroz URL parametar */
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [direct, setDirect] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loopRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Promise<VimeoPlayer> | null>(null);
  /* Klik pre nego što je iframe montiran — odigraj čim se player napravi. */
  const wantsPlayRef = useRef(false);

  /* Ako korisnik klikne pre nego što je iframe uopšte montiran, autoplay ide
     kroz URL. allow="autoplay" na iframe-u dozvoljava i zvuk. */
  const src =
    `https://player.vimeo.com/video/${vimeoId}` +
    `?badge=0&byline=0&portrait=0&title=0&dnt=1&playsinline=1&controls=1` +
    `&autoplay=${direct ? 1 : 0}&muted=0`;

  const arm = useCallback(() => {
    preconnectVimeo();
    setArmed(true);
  }, []);

  /* Napravi Player čim je iframe u DOM-u. */
  useEffect(() => {
    if (!armed || !iframeRef.current || playerRef.current) return;

    const el = iframeRef.current;
    playerRef.current = loadVimeoSdk().then((V) => new V.Player(el));

    playerRef.current
      .then((p) => {
        if (wantsPlayRef.current) {
          wantsPlayRef.current = false;
          p.setCurrentTime(0).catch(() => {});
          p.setVolume(1).catch(() => {});
          return p.play();
        }
        return undefined;
      })
      .catch(() => {
        /* Adblocker ili pad mreže — vrati se na autoplay preko URL-a. */
        if (wantsPlayRef.current) {
          wantsPlayRef.current = false;
          setDirect(true);
        }
      });

    return () => {
      playerRef.current?.then((p) => p.destroy().catch(() => {})).catch(() => {});
      playerRef.current = null;
    };
  }, [armed]);

  /* Vimeo se priprema cim se player priblizi ekranu — do klika je player.js
     ucitan, iframe montiran i konfiguracija povucena, pa play krece odmah.
     Sa autoplay=0 Vimeo ne skida same segmente videa, samo player. */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || armed) return;
    if (typeof IntersectionObserver === 'undefined') {
      preconnectVimeo();
      setArmed(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        preconnectVimeo();
        setArmed(true);
        io.disconnect();
      },
      { rootMargin: '400px' }
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [armed]);

  /* Loop ne troši CPU i bateriju dok je van ekrana. */
  useEffect(() => {
    const el = loopRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap || typeof IntersectionObserver === 'undefined') return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      el.pause();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (playing) return;
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.1 }
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [playing]);

  const start = useCallback(() => {
    setArmed(true);
    setPlaying(true);
    loopRef.current?.pause();

    const pending = playerRef.current;
    if (!pending) {
      /* Iframe se tek montira u ovom renderu — obradi ga effect iznad. */
      wantsPlayRef.current = true;
      return;
    }
    pending
      .then((p) => {
        p.setCurrentTime(0).catch(() => {});
        p.setVolume(1).catch(() => {});
        return p.play();
      })
      .catch(() => setDirect(true));
  }, []);

  return (
    <div ref={wrapRef} className={`aspect-video relative bg-black overflow-hidden ${className}`}>
      {/* Loop u pozadini */}
      <video
        ref={loopRef}
        src={loopSrc}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          playing ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Pun klip sa Vimea */}
      {armed && (
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          frameBorder="0"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          allowFullScreen
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
            playing ? 'opacity-100 z-20' : 'opacity-0 pointer-events-none'
          }`}
        />
      )}

      {/* Play dugme preko loopa */}
      {!playing && (
        <button
          type="button"
          onClick={start}
          onMouseEnter={arm}
          onTouchStart={arm}
          onFocus={arm}
          aria-label={headline}
          style={{ touchAction: 'manipulation' }}
          className="absolute inset-0 z-30 flex items-center justify-center cursor-pointer group bg-gradient-to-b from-black/10 via-transparent to-black/50"
        >
          <span className="text-center">
            <span
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${accentButton} backdrop-blur-sm flex items-center justify-center mb-2 md:mb-3 mx-auto shadow-lg transition-transform duration-300 group-hover:scale-110 group-active:scale-95`}
            >
              <Play className="w-6 h-6 md:w-7 md:h-7 ml-0.5" />
            </span>
            <span
              className={`block ${accentBadge} backdrop-blur-sm rounded-lg px-3 py-2 md:px-4 md:py-2.5 border`}
            >
              <span className="block text-white font-bold text-xs md:text-sm mb-0.5">{headline}</span>
              <span className="block text-white/70 text-[10px] md:text-xs">{subline}</span>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
