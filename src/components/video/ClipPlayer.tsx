import { useCallback, useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { usePointerFine } from '../../hooks/usePointerFine';

/* ClipPlayer — 15s nemi loop sa našeg domena se vrti u pozadini, a klik pušta
   pun klip. Odakle dolazi pun klip zavisi od uređaja, i to nije stvar ukusa
   nego politike autoplay-a u browserima:

   DESKTOP (pointer: fine) → Vimeo iframe.
   Iframe se montira unapred sa autoplay=0, Player SDK se povuče dok se sekcija
   približava ekranu, a klik pozove setCurrentTime + setVolume + play. Klip
   krene od nule sa zvukom, bez reloada i bez treptaja. Vimeo uz to nosi
   adaptivni bitrate i svoj CDN, pa nema razloga da ga menjamo.

   MOBILNI (pointer: coarse) → self-hosted MP4 u <video> elementu.
   Zvuk na dodir se NE može dobiti iz Vimeo iframe-a, koliko god se kod
   prepravljao: Chrome na Androidu dozvoljava autoplay sa zvukom samo ako je
   sajt dodat na home screen, a iOS Safari traži gest unutar samog frejma.
   Korisnikov tap po našem dugmetu ne prelazi granicu cross-origin iframe-a,
   pa Vimeo padne na muted i ponudi „unmute" — tačno ono što smo videli.
   Zato na dodiru pun klip mora da bude <video> u našem dokumentu: tada je
   play() pozvan sinhrono iz onClick-a običan gest nad običnim medijem i
   prolazi sa zvukom, iz prve, i na iOS-u i na Androidu.

   Ako mobilni fajl nije postavljen (fullSrcMobile izostavljen ili 404), sve se
   vraća na Vimeo putanju — sajt radi i bez tih fajlova, samo bez zvuka iz
   prve. Zato se postojanje fajla proverava HEAD zahtevom unapred, dok se
   player približava ekranu, a ne u trenutku tapa: provera u tap handleru bi
   potrošila gest na čekanje mreže i vratila nas na isti problem. */

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
  /** Vimeo ID punog klipa, npr. '1222709692'. Desktop i mobilni fallback. */
  vimeoId: string;
  /**
   * Pun klip sa našeg domena, u mobilnoj rezoluciji — npr.
   * '/videos/izrada-sajta-full.mp4'. Koristi se samo na dodirnim uređajima,
   * jer je jedini način da tap odmah da zvuk. Ako fajla nema, mobilni pada
   * nazad na Vimeo.
   */
  fullSrcMobile?: string;
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
  fullSrcMobile,
  loopSrc,
  poster,
  title,
  headline,
  subline,
  accentButton = 'bg-white/90',
  accentBadge = 'bg-black/60 border-white/10',
  className = '',
}: ClipPlayerProps) {
  const fine = usePointerFine();

  /* armed = Vimeo iframe je montiran; playing = pun klip je preuzeo ekran;
     direct = Vimeo autoplay ide kroz URL parametar, bez SDK-a;
     loaded = iframe je javio load, pa smemo da sklonimo loop ispod njega;
     nativeOk = mobilni MP4 postoji (null dok provera traje). */
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [direct, setDirect] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [nativeOk, setNativeOk] = useState<boolean | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loopRef = useRef<HTMLVideoElement>(null);
  const fullRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Promise<VimeoPlayer> | null>(null);
  const wantsPlayRef = useRef(false);

  /* Native putanja se koristi samo kad je uređaj dodirni I fajl stvarno tu.
     Dok provera traje (nativeOk === null) tap ide na Vimeo — čekanje mreže bi
     potrošilo gest. */
  const useNative = !fine && !!fullSrcMobile && nativeOk === true;

  const src =
    `https://player.vimeo.com/video/${vimeoId}` +
    `?badge=0&byline=0&portrait=0&title=0&dnt=1&playsinline=1&controls=1` +
    `&autoplay=${direct ? 1 : 0}&muted=0`;

  const arm = useCallback(() => {
    preconnectVimeo();
    if (fine) setArmed(true);
  }, [fine]);

  /* Vimeo Player SDK — samo desktop. */
  useEffect(() => {
    if (!fine || direct) return;
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
  }, [armed, fine, direct]);

  /* Da li je mobilni fajl tu, saznajemo od samog <video> elementa.

     Provera readyState-a pre kacenja slusaca nije suvisna: loadedmetadata ne
     bubbluje, pa ga React kaci direktno na element tek u commit fazi, a kod
     keširanog fajla metapodaci stignu pre toga. Sa samim onLoadedMetadata u
     JSX-u je zato nativeOk ostajao null pri svakoj drugoj poseti i tap je bez
     razloga isao na Vimeo. */
  useEffect(() => {
    const v = fullRef.current;
    if (fine || !fullSrcMobile || !v) return;

    if (v.error) {
      setNativeOk(false);
      return;
    }
    if (v.readyState >= 1 /* HAVE_METADATA */) {
      setNativeOk(true);
      return;
    }

    const ok = () => setNativeOk(true);
    const fail = () => setNativeOk(false);
    v.addEventListener('loadedmetadata', ok);
    v.addEventListener('error', fail);
    return () => {
      v.removeEventListener('loadedmetadata', ok);
      v.removeEventListener('error', fail);
    };
  }, [fine, fullSrcMobile]);

  /* Desktop: Vimeo se priprema čim se player približi ekranu — do klika je
     player.js učitan, iframe montiran i konfiguracija povučena. Ovo je čista
     optimizacija; ako IO izostane, klik i dalje radi kroz start(). */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !fine || armed) return;

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
  }, [fine, armed]);

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
    loopRef.current?.pause();
    setPlaying(true);

    if (useNative) {
      /* Sve pre play() mora da bude sinhrono — svaki await ovde bi izašao iz
         gesta i browser bi odbio zvuk. */
      const v = fullRef.current;
      if (v) {
        v.muted = false;
        v.volume = 1;
        const p = v.play();
        /* Ako bi play ipak pao (npr. fajl je u međuvremenu nestao), pusti bez
           zvuka umesto da ekran ostane prazan. */
        p?.catch(() => {
          v.muted = true;
          void v.play().catch(() => {});
        });
      }
      return;
    }

    setArmed(true);
    if (!fine) {
      /* Dodir bez mobilnog fajla: montiraj iframe sa autoplay=1 unutar gesta.
         Zvuk ovde zavisi od Vimea i browsera i nije zagarantovan. */
      setDirect(true);
      return;
    }

    const pending = playerRef.current;
    if (!pending) {
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
  }, [fine, useNative]);

  /* Kad se klip završi, vrati loop i dugme — stranica ne ostaje na crnom. */
  const handleEnded = useCallback(() => {
    setPlaying(false);
    const v = fullRef.current;
    if (v) v.currentTime = 0;
    void loopRef.current?.play().catch(() => {});
  }, []);

  /* Loop se sklanja tek kad ono što ide preko njega ume da se prikaže. */
  const clipVisible = playing && (useNative || loaded || !direct);

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
          clipVisible ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Pun klip u nasem dokumentu — mobilni.

          Element se montira odmah (ne ceka ni IO ni tap) i sam sluzi kao
          provera: loadedmetadata znaci da je fajl tu, error da nije. Zato nema
          HEAD zahteva — fetch bi na fajlu sa drugog domena bez CORS zaglavlja
          pao i nepotrebno nas vratio na Vimeo, a <video> ucitava cross-origin
          bez ikakvih zaglavlja. Zbog toga fullSrcMobile sme da bude i URL sa
          CDN-a, ne mora sa naseg domena — za zvuk je bitno samo da je <video>
          u nasem dokumentu, ne odakle fajl dolazi. */}
      {!fine && fullSrcMobile && (
        <video
          ref={fullRef}
          src={fullSrcMobile}
          poster={poster}
          playsInline
          controls={playing}
          preload="metadata"
          onEnded={handleEnded}
          className={`absolute inset-0 w-full h-full object-contain bg-black transition-opacity duration-300 ${
            playing && useNative ? 'opacity-100 z-20' : 'opacity-0 pointer-events-none'
          }`}
        />
      )}

      {/* Pun klip sa Vimea — desktop i mobilni fallback */}
      {armed && (
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          frameBorder="0"
          onLoad={() => setLoaded(true)}
          referrerPolicy="strict-origin-when-cross-origin"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          allowFullScreen
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
            clipVisible ? 'opacity-100 z-20' : 'opacity-0 pointer-events-none'
          }`}
        />
      )}

      {/* Kratak trenutak izmedju tapa i prvog frejma sa Vimea */}
      {playing && !clipVisible && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 pointer-events-none">
          <span className="w-10 h-10 rounded-full border-2 border-white/25 border-t-white animate-spin" />
        </div>
      )}

      {/* Play dugme preko loopa */}
      {!playing && (
        <button
          type="button"
          onClick={start}
          onMouseEnter={arm}
          onPointerDown={arm}
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
