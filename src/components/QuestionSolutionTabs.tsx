import React, { useState } from 'react';
import { Sparkles, Play, Video } from 'lucide-react';

export function parseYouTubeVideoId(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Direct 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // youtu.be/<id>
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (shortMatch && shortMatch[1]) return shortMatch[1];

  // youtube.com/shorts/<id>
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

  // youtube.com/embed/<id>
  const embedMatch = trimmed.match(/youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/i);
  if (embedMatch && embedMatch[1]) return embedMatch[1];

  // youtube.com/watch?v=<id> or other parameters
  const watchMatch = trimmed.match(/(?:[?&]v=|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/i);
  if (watchMatch && watchMatch[1]) return watchMatch[1];

  // General regex fallback for any youtube URL containing an 11-character ID
  const anyYt = trimmed.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (anyYt && anyYt[1]) return anyYt[1];

  return null;
}

interface QuestionSolutionTabsProps {
  textSolution?: string;
  videoUrl?: string;
  defaultTab?: 'text' | 'video';
  theme?: 'default' | 'cbt';
  className?: string;
}

export const QuestionSolutionTabs: React.FC<QuestionSolutionTabsProps> = ({
  textSolution,
  videoUrl,
  defaultTab = 'text',
  theme = 'default',
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'video'>(defaultTab);

  const cleanUrl = (videoUrl || '').trim();
  const ytId = parseYouTubeVideoId(cleanUrl);
  const isDirectVideo = cleanUrl ? /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(cleanUrl) : false;
  const hasVideo = !!(ytId || isDirectVideo || (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')));

  return (
    <div className={`space-y-3.5 ${className}`}>
      {/* Segmented Pill Switch Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="p-1 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center gap-1 shadow-inner backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'text'
                ? 'bg-white text-black shadow-md font-black scale-[1.02]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Text Solution</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'video'
                ? 'bg-white text-black shadow-md font-black scale-[1.02]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Video Solution</span>
            {!hasVideo ? (
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Soon
              </span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Tab Panel Content */}
      {activeTab === 'text' ? (
        <div
          className={`p-5 rounded-2xl space-y-2 border transition-all animate-in fade-in duration-200 ${
            theme === 'cbt'
              ? 'bg-emerald-500/[0.06] border-emerald-500/20'
              : 'bg-cyan-500/[0.06] border-cyan-500/20'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Explanation:</span>
          </div>

          {textSolution ? (
            <p className="text-sm sm:text-[15px] text-white/90 leading-relaxed whitespace-pre-wrap font-medium">
              {textSolution}
            </p>
          ) : (
            <p className="text-sm text-white/40 italic">
              No written text explanation provided for this question.
            </p>
          )}
        </div>
      ) : (
        <div className="animate-in fade-in duration-200">
          {ytId ? (
            /* YouTube Video Player Embed */
            <div className="space-y-2.5">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/90 border border-white/15 shadow-2xl">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&autoplay=0`}
                  title="Video Solution Walkthrough"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          ) : isDirectVideo && cleanUrl ? (
            /* Direct MP4/Video Player */
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl">
              <video src={cleanUrl} controls className="w-full h-full object-contain" />
            </div>
          ) : cleanUrl && (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) ? (
            /* Generic Web Video Frame Fallback */
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/90 border border-white/15 shadow-2xl">
              <iframe
                src={cleanUrl}
                title="Video Solution"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            /* Video Solution Coming Soon State */
            <div className="p-8 sm:p-10 rounded-2xl bg-white/[0.025] border border-white/10 text-center flex flex-col items-center justify-center space-y-3.5 shadow-inner">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500/15 to-purple-500/15 border border-rose-500/25 flex items-center justify-center text-rose-400 shadow-lg">
                <Video className="w-7 h-7 stroke-[2]" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-center gap-2">
                  <h4 className="text-base font-black text-white tracking-tight">Video Solution</h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Coming Soon
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/50 max-w-md mx-auto leading-relaxed">
                  Our subject experts are currently recording a detailed step-by-step video solution for this question. It will be available here soon!
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
