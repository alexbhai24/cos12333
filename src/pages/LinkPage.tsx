import React, { useState, useEffect } from 'react';
import linkService, { LinkConfig } from '../services/linkService';

export const LinkPage: React.FC = () => {
  const [, setConfig] = useState<LinkConfig>(() => linkService.getConfig());
  const [activeUrl, setActiveUrl] = useState<string>(() => linkService.getConfig().mainUrl);
  const [iframeKey] = useState(0);

  useEffect(() => {
    const unsub = linkService.subscribe((newConfig) => {
      setConfig(newConfig);
      if (!newConfig.tools.some(t => t.url === activeUrl) && activeUrl !== newConfig.mainUrl) {
        setActiveUrl(newConfig.mainUrl);
      }
    });
    return unsub;
  }, [activeUrl]);

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] w-full bg-[#0b0e1b] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">

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
