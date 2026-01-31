import { memo, useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { VideoGatePopup } from '../ui/VideoGatePopup';

interface YouTubeVideoProps {
  videoId: string;
  title?: string;
  className?: string;
  requireGate?: boolean; // Nova opcija za video gate
}

export const YouTubeVideo = memo(function YouTubeVideo({ 
  videoId, 
  title = 'YouTube video player', 
  className = '',
  requireGate = false
}: YouTubeVideoProps) {
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [showGatePopup, setShowGatePopup] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);

  // Proveri da li je korisnik već otkljucao video (sacuvano u localStorage)
  useEffect(() => {
    const unlocked = localStorage.getItem(`video_unlocked_${videoId}`);
    if (unlocked === 'true') {
      setHasUnlocked(true);
    }
  }, [videoId]);

  const handleOverlayClick = () => {
    if (!requireGate || hasUnlocked) {
      // Ako video gate nije potreban ili je vec otkljucan, pokreni video
      setVideoStarted(true);
    } else {
      // Prikaži popup za otkljucavanje
      setShowGatePopup(true);
    }
  };

  const handleGateSubmitSuccess = () => {
    // Zatvori popup, otkljucaj video i pokreni ga
    setShowGatePopup(false);
    setHasUnlocked(true);
    setVideoStarted(true);
    // Sacuvaj u localStorage da je korisnik otkljucao video
    localStorage.setItem(`video_unlocked_${videoId}`, 'true');
  };

  return (
    <>
      <div className={`relative w-full pt-[56.25%] overflow-hidden rounded-xl ${className}`}>
        {!videoStarted && requireGate && !hasUnlocked && (
          // Overlay sa fake play dugmetom (pre nego što je video otključan)
          <div 
            onClick={handleOverlayClick}
            className="absolute inset-0 z-10 cursor-pointer group"
            style={{
              background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-white/90 rounded-full p-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <Play className="w-12 h-12 text-gray-900 fill-gray-900" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!videoStarted && (!requireGate || hasUnlocked) && (
          // Obican overlay sa play dugmetom (video je otkljucan ili gate nije potreban)
          <div 
            onClick={handleOverlayClick}
            className="absolute inset-0 z-10 cursor-pointer group"
            style={{
              background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-white/90 rounded-full p-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <Play className="w-12 h-12 text-gray-900 fill-gray-900" />
                </div>
              </div>
            </div>
          </div>
        )}

        {videoStarted && (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {showGatePopup && (
        <VideoGatePopup 
          onClose={() => setShowGatePopup(false)}
          onSubmitSuccess={handleGateSubmitSuccess}
        />
      )}
    </>
  );
});