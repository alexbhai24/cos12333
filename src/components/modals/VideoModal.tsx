import React, { useRef, useEffect, useState } from 'react';
import { X, Maximize, ExternalLink, Calendar, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { extractYoutubeId } from '../../services/videoService';

export const VideoModal: React.FC = () => {
  const { activeVideoModal, setActiveVideoModal, claimDailyStreak, showNotification, videoWatchProgress, setVideoWatchProgress } = useApp();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [streakClaimed, setStreakClaimed] = useState(false);

  useEffect(() => {
    if (!activeVideoModal) {
      setStreakClaimed(false);
      return;
    }

    const interval = setInterval(() => {
      setVideoWatchProgress(prev => {
        const next = prev + 1;
        if (next === 600 && !streakClaimed) {
          claimDailyStreak();
          showNotification("🎯 You watched 10 minutes of educational content! Streak secured! 🔥");
          setStreakClaimed(true);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeVideoModal, claimDailyStreak, showNotification, streakClaimed, setVideoWatchProgress]);

  if (!activeVideoModal) return null;

  const videoId = extractYoutubeId(activeVideoModal.videoUrl || '');
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    : activeVideoModal.videoUrl;

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      } else if ((iframeRef.current as any).webkitRequestFullscreen) {
        (iframeRef.current as any).webkitRequestFullscreen();
      } else if ((iframeRef.current as any).msRequestFullscreen) {
        (iframeRef.current as any).msRequestFullscreen();
      }
    }
  };

  // Human-readable date helper
  const formattedDate = activeVideoModal.createdAt
    ? new Date(activeVideoModal.createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : 'Recently';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#09182D]/95 border border-[rgba(0,240,255,0.25)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#06101F]/80 border-b border-[rgba(0,240,255,0.15)]">
          <div>
            <span className="px-2 py-0.5 rounded bg-[#00F0FF]/10 border border-[#00F0FF]/20 text-[#00F0FF] text-[9px] font-bold uppercase tracking-wider block w-fit mb-1">
              {activeVideoModal.subject}
            </span>
            <h2 className="text-sm md:text-base font-bold text-white font-heading line-clamp-1">
              {activeVideoModal.title}
            </h2>
          </div>
          <button
            onClick={() => setActiveVideoModal(null)}
            className="p-2 text-gray-400 hover:text-white rounded-xl bg-white/5 border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center border-b border-white/5">
          {embedUrl ? (
            <iframe
              ref={iframeRef}
              src={embedUrl}
              title={activeVideoModal.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="text-center text-gray-500 py-10">No valid video URL available.</div>
          )}
        </div>

        {/* Footer controls & Description */}
        <div className="p-6 overflow-y-auto space-y-4 bg-[#09182D]/40 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
              <span className="flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-white">{activeVideoModal.authorName}</span>
                <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-400">
                  {activeVideoModal.authorRole || 'Teacher'}
                </span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Published {formattedDate}</span>
              </span>
            </div>

            {/* Fullscreen Button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleFullscreen}
                className="px-3.5 py-2 bg-[#00F0FF] hover:bg-cyan-400 text-black font-extrabold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
              >
                <Maximize className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Fullscreen</span>
              </button>

              {videoId && (
                <a
                  href={`https://youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                  title="Watch on YouTube"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">About this Lecture</h3>
            <p className="text-xs text-gray-300 leading-relaxed max-w-none">
              {activeVideoModal.description ||
                'Watch structured video lectures and academic notes curated for exam targets.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
