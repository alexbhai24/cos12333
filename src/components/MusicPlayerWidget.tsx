import React, { useState, useRef } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat,
  Volume2, VolumeX, Pencil, Plus, X, Music, List
} from 'lucide-react';
import { useMusic, MusicTrack } from '../context/MusicContext';

function formatTime(secs: number): string {
  if (!isFinite(secs) || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const TrackImage: React.FC<{ imageUrl: string; title: string; size?: string }> = ({ imageUrl, title, size = 'w-12 h-12' }) => {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={title}
        className={`${size} rounded-xl object-cover flex-shrink-0`}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
    );
  }
  return (
    <div className={`${size} rounded-xl bg-gradient-to-br from-[var(--color-cyan)]/20 to-[var(--color-violet)]/20 border border-white/10 flex items-center justify-center flex-shrink-0`}>
      <Music className="w-5 h-5 text-[var(--color-cyan)]/60" />
    </div>
  );
};

// ─── Edit Panel ────────────────────────────────────────────────────────────────
interface EditPanelProps {
  track: MusicTrack | null; // null = new track
  onSave: (track: MusicTrack) => void;
  onDelete?: () => void;
  onClose: () => void;
}

const EditPanel: React.FC<EditPanelProps> = ({ track, onSave, onDelete, onClose }) => {
  const [title, setTitle] = useState(track?.title ?? '');
  const [artist, setArtist] = useState(track?.artist ?? '');
  const [audioUrl, setAudioUrl] = useState(track?.audioUrl ?? '');
  const [imageUrl, setImageUrl] = useState(track?.imageUrl ?? '');

  const handleSave = () => {
    if (!title.trim() || !audioUrl.trim()) return;
    onSave({
      id: track?.id ?? `track-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: title.trim(),
      artist: artist.trim() || 'Unknown Artist',
      audioUrl: audioUrl.trim(),
      imageUrl: imageUrl.trim(),
    });
  };

  return (
    <div className="absolute right-0 top-0 bottom-0 w-full z-50 flex flex-col bg-[#0d1117] border border-[var(--color-cyan)]/30 rounded-3xl shadow-[0_0_40px_rgba(0,240,255,0.15)] overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0A0F2E]/60">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-[var(--color-cyan)]" />
          <span className="text-sm font-extrabold text-white">
            {track ? 'Edit Track' : 'Add Track'}
          </span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {imageUrl && (
          <div className="flex justify-center">
            <img src={imageUrl} alt="preview" className="w-24 h-24 rounded-2xl object-cover border border-white/10" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
          </div>
        )}

        {[
          { label: 'Title', val: title, set: setTitle, placeholder: 'Track title...', required: true },
          { label: 'Artist / Subtitle', val: artist, set: setArtist, placeholder: 'Artist name...' },
          { label: 'Audio URL (YouTube / direct link)', val: audioUrl, set: setAudioUrl, placeholder: 'https://... (mp3, youtube url, soundcloud)', required: true },
          { label: 'Image URL', val: imageUrl, set: setImageUrl, placeholder: 'https://... (jpg, png, webp)' },
        ].map(({ label, val, set, placeholder, required }) => (
          <div key={label} className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              {label}
              {required && <span className="text-[var(--color-cyan)]">*</span>}
            </label>
            <input
              value={val}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-cyan)]/60 transition-colors"
            />
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <button
          onClick={handleSave}
          disabled={!title.trim() || !audioUrl.trim()}
          className="w-full py-2.5 bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)] text-[#030816] font-extrabold text-xs rounded-xl transition-all hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {track ? 'Save Changes' : 'Add to Playlist'}
        </button>
        {track && onDelete && (
          <button
            onClick={onDelete}
            className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs rounded-xl transition-all active:scale-95"
          >
            Remove Track
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Main Player Widget Component ──────────────────────────────────────────────
export const MusicPlayerWidget: React.FC = () => {
  const {
    tracks,
    currentIdx,
    isPlaying,
    progress,
    duration,
    currentTime,
    volume,
    isMuted,
    shuffle,
    repeat,
    showPlaylist,
    currentTrack,
    handlePlayPause,
    handleNext,
    handlePrev,
    handleSelectTrack,
    handleProgressSeek,
    handleSaveTrack: saveToContext,
    handleDeleteTrack: deleteFromContext,
    setVolume,
    setIsMuted,
    setShuffle,
    setRepeat,
    setShowPlaylist,
  } = useMusic();

  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<MusicTrack | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressBarRef.current;
    if (!bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    handleProgressSeek(ratio);
  };

  const handleSaveTrack = (track: MusicTrack) => {
    saveToContext(track, editingIdx);
    setEditPanelOpen(false);
  };

  const handleDeleteTrack = () => {
    if (editingIdx !== null) {
      deleteFromContext(editingIdx);
    }
    setEditPanelOpen(false);
  };

  const openNewTrack = () => {
    setEditingTrack(null);
    setEditingIdx(null);
    setEditPanelOpen(true);
  };

  const openEditTrack = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTrack(tracks[idx]);
    setEditingIdx(idx);
    setEditPanelOpen(true);
  };

  return (
    <div className="relative bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.07)]">
      {/* Edit panel overlay */}
      {editPanelOpen && (
        <EditPanel
          track={editingTrack}
          onSave={handleSaveTrack}
          onDelete={editingIdx !== null ? handleDeleteTrack : undefined}
          onClose={() => setEditPanelOpen(false)}
        />
      )}

      {/* ── Main Player Area */}
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-[var(--color-cyan)]" />
            <span className="text-xs font-extrabold text-white uppercase tracking-wider">Music Player</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={openNewTrack}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-[var(--color-cyan)] transition-colors"
              title="Add track"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowPlaylist(p => !p)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
              title="Toggle playlist"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Now Playing */}
        {currentTrack ? (
          <div className="flex items-center gap-3">
            <TrackImage imageUrl={currentTrack.imageUrl} title={currentTrack.title} size="w-14 h-14" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-extrabold text-white truncate">{currentTrack.title}</div>
              <div className="text-[11px] text-[var(--text-muted)] truncate">{currentTrack.artist}</div>
            </div>
            <button
              onClick={(e) => openEditTrack(currentIdx, e)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-600 hover:text-[var(--color-cyan)] transition-colors flex-shrink-0"
              title="Edit track"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-600 text-xs">No tracks in your playlist — add one with +</div>
        )}

        {/* Progress Bar */}
        <div className="space-y-1">
          <div
            ref={progressBarRef}
            onClick={handleProgressClick}
            className="relative h-1.5 bg-white/10 rounded-full cursor-pointer group"
          >
            <div
              className="h-full bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-violet)] rounded-full transition-all"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progress * 100}% - 6px)` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-600 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShuffle(s => !s)}
            className={`p-1.5 rounded-lg transition-colors ${shuffle ? 'text-[var(--color-cyan)]' : 'text-gray-600 hover:text-white'}`}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <button onClick={handlePrev} className="p-1.5 text-gray-400 hover:text-white transition-colors">
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={handlePlayPause}
            disabled={!currentTrack}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-cyan)] to-[var(--color-violet)] flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
          >
            {isPlaying
              ? <Pause className="w-4 h-4 text-[#030816]" />
              : <Play className="w-4 h-4 text-[#030816] ml-0.5" />
            }
          </button>

          <button onClick={handleNext} className="p-1.5 text-gray-400 hover:text-white transition-colors">
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => setRepeat(r => !r)}
            className={`p-1.5 rounded-lg transition-colors ${repeat ? 'text-[var(--color-cyan)]' : 'text-gray-600 hover:text-white'}`}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(m => !m)} className="text-gray-500 hover:text-white transition-colors">
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <input
            type="range" min="0" max="1" step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
            className="flex-1 h-1 accent-[var(--color-cyan)] cursor-pointer"
          />
        </div>
      </div>

      {/* ── Playlist */}
      {showPlaylist && tracks.length > 0 && (
        <div className="border-t border-white/5 max-h-48 overflow-y-auto">
          {tracks.map((track, idx) => (
            <div
              key={track.id}
              onClick={() => handleSelectTrack(idx)}
              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all hover:bg-white/5 group ${idx === currentIdx ? 'bg-[var(--color-cyan)]/5 border-l-2 border-[var(--color-cyan)]' : 'border-l-2 border-transparent'}`}
            >
              <TrackImage imageUrl={track.imageUrl} title={track.title} size="w-8 h-8" />
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-bold truncate ${idx === currentIdx ? 'text-[var(--color-cyan)]' : 'text-white'}`}>
                  {track.title}
                </div>
                <div className="text-[10px] text-gray-500 truncate">{track.artist}</div>
              </div>
              <button
                onClick={(e) => openEditTrack(idx, e)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-all"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MusicPlayerWidget;
