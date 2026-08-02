import React, { useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Video, 
  FileText, 
  BookOpen, 
  Award,
  ArrowRight, 
  Compass 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  MOCK_VIDEOS,
  MOCK_DOCUMENTS,
  MOCK_BOOKS,
  MOCK_TESTS
} from '../data/mockData';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    setCurrentRoute,
    setActiveVideoModal,
    setActiveDocModal,
    setActiveBookModal,
    setActiveTestModal
  } = useApp();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = searchQuery.toLowerCase().trim();

  const matchingVideos = MOCK_VIDEOS.filter(
    v => !q || v.title.toLowerCase().includes(q) || v.subject.toLowerCase().includes(q)
  );

  const matchingDocs = MOCK_DOCUMENTS.filter(
    d => !q || d.title.toLowerCase().includes(q) || d.subject.toLowerCase().includes(q)
  );

  const matchingBooks = MOCK_BOOKS.filter(
    b => !q || b.title.toLowerCase().includes(q) || (b.subject || '').toLowerCase().includes(q)
  );

  const matchingTests = MOCK_TESTS.filter(
    t => !q || t.title.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)
  );

  const hasResults = 
    matchingVideos.length > 0 || 
    matchingDocs.length > 0 || 
    matchingBooks.length > 0 || 
    matchingTests.length > 0;

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsSearchOpen(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-xl bg-[#060918]/95 border border-[rgba(0,240,255,0.22)] rounded-3xl shadow-[0_25px_60px_rgba(0,240,255,0.15)] overflow-hidden flex flex-col max-h-[70vh] animate-in slide-in-from-top-4 duration-300">
        
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-[#0B0F29]/80">
          <Search className="w-4 h-4 text-cyan-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search courses, videos, notes, books, tests..."
            className="w-full bg-transparent text-white placeholder-gray-500 text-xs font-medium focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="ml-3 text-[10px] font-bold px-2 py-1 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:text-white transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-premium">
          {!hasResults ? (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
              <Compass className="w-10 h-10 text-gray-600 animate-pulse" />
              <div className="text-xs font-semibold text-gray-400">No matching resources found</div>
              <p className="text-[10px] text-gray-500 max-w-xs">
                Try searching for general keywords like "Physics", "Chemistry", "NEET", or "Biology".
              </p>
            </div>
          ) : (
            <>
              {/* Videos */}
              {matchingVideos.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2.5">
                    <Video className="w-3.5 h-3.5" />
                    <span>Video Lectures ({matchingVideos.length})</span>
                  </div>
                  <div className="space-y-2">
                    {matchingVideos.slice(0, 3).map(v => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setCurrentRoute('videos');
                          setActiveVideoModal(v);
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-[#090C22]/60 hover:bg-[#0D152D] border border-white/5 hover:border-cyan-500/25 transition-all text-left group"
                      >
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{v.title}</div>
                          <div className="text-[10px] text-gray-400">{v.subject} • {v.duration}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Study Notes */}
              {matchingDocs.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-[#FF6565] uppercase tracking-widest mb-2.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Study Notes ({matchingDocs.length})</span>
                  </div>
                  <div className="space-y-2">
                    {matchingDocs.slice(0, 3).map(d => (
                      <button
                        key={d.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setCurrentRoute('documents');
                          setActiveDocModal(d);
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-[#090C22]/60 hover:bg-[#0D152D] border border-white/5 hover:border-[#FF6565]/25 transition-all text-left group"
                      >
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-white group-hover:text-[#FF6565] transition-colors">{d.title}</div>
                          <div className="text-[10px] text-gray-400">{d.subject} • {d.fileType} ({d.fileSize})</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#FF6565] group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Books */}
              {matchingBooks.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-[#37D996] uppercase tracking-widest mb-2.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Textbooks ({matchingBooks.length})</span>
                  </div>
                  <div className="space-y-2">
                    {matchingBooks.slice(0, 2).map(b => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setCurrentRoute('books');
                          setActiveBookModal(b);
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-[#090C22]/60 hover:bg-[#0D152D] border border-white/5 hover:border-[#37D996]/25 transition-all text-left group"
                      >
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-white group-hover:text-[#37D996] transition-colors">{b.title}</div>
                          <div className="text-[10px] text-gray-400">{b.authorName} • {b.subject}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#37D996] group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tests */}
              {matchingTests.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-[#A855F7] uppercase tracking-widest mb-2.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Tests & Quizzes ({matchingTests.length})</span>
                  </div>
                  <div className="space-y-2">
                    {matchingTests.slice(0, 2).map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setCurrentRoute('tests');
                          setActiveTestModal(t);
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-[#090C22]/60 hover:bg-[#0D152D] border border-white/5 hover:border-[#A855F7]/25 transition-all text-left group"
                      >
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-white group-hover:text-[#A855F7] transition-colors">{t.title}</div>
                          <div className="text-[10px] text-gray-400">{t.subject} • {t.durationMinutes} mins</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#A855F7] group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
