import React, { useState, useEffect } from 'react';
import { Globe, ExternalLink, RefreshCw, ChevronDown, Link2 } from 'lucide-react';
import linkService, { LinkConfig } from '../services/linkService';

export const LinkPage: React.FC = () => {
  const [config, setConfig] = useState<LinkConfig>(() => linkService.getConfig());
  const [activeUrl, setActiveUrl] = useState<string>(() => linkService.getConfig().mainUrl);
  const [iframeKey, setIframeKey] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const unsub = linkService.subscribe((newConfig) => {
      setConfig(newConfig);
      if (!newConfig.tools.some(t => t.url === activeUrl) && activeUrl !== newConfig.mainUrl) {
        setActiveUrl(newConfig.mainUrl);
      }
    });
    return unsub;
  }, [activeUrl]);

  const allTools = [
    { label: `${config.siteName || 'Link'} (Home)`, url: config.mainUrl },
    ...config.tools.filter(t => t.url !== config.mainUrl),
  ];

  const activeTool = allTools.find(t => t.url === activeUrl) || { label: 'Link', url: activeUrl };

  const handleRefresh = () => setIframeKey(k => k + 1);

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] w-full bg-[#0b0e1b] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">

      {/* ── Premium Header Bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111322]/95 border-b border-white/[0.07] flex-shrink-0 gap-3">

        {/* Title */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-black text-white leading-none">Link</p>
            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
              <Link2 className="w-2.5 h-2.5 text-cyan-400" />
              <span>{config.siteName || 'Embedded Link'}</span>
            </p>
          </div>
        </div>

        {/* Tool Selector Dropdown */}
        <div className="relative flex-1 max-w-xs">
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-slate-200 hover:text-white transition-all gap-2"
          >
            <span className="truncate font-semibold">{activeTool.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full mt-1.5 left-0 right-0 z-50 bg-[#111322] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto scrollbar-none">
              {allTools.map(tool => (
                <button
                  key={tool.url}
                  onClick={() => { setActiveUrl(tool.url); setIframeKey(k => k + 1); setDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                    tool.url === activeUrl
                      ? 'bg-cyan-500/20 text-cyan-400 font-bold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {tool.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleRefresh}
            title="Refresh"
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <a
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new tab"
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* ── Embedded iframe ─────────────────────────────────────────────── */}
      <div className="flex-1 w-full h-full relative overflow-hidden bg-[#0d1117]">
        <iframe
          key={iframeKey}
          src={activeUrl}
          title="Link Embed"
          className="w-full h-full border-0 min-h-[600px]"
          allow="clipboard-read; clipboard-write; camera; microphone"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
        />
      </div>

    </div>
  );
};
export default LinkPage;
