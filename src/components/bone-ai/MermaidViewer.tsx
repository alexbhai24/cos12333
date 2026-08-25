import React, { useEffect, useRef, useState } from 'react';
// @ts-expect-error bypass Vercel missing module
import mermaid from 'mermaid';
import { Copy, Check, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface MermaidViewerProps {
  chart: string;
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    darkMode: true,
    background: '#0a101f',
    primaryColor: '#00F0FF',
    primaryTextColor: '#FFFFFF',
    primaryBorderColor: '#00F0FF',
    lineColor: '#00F0FF',
    secondaryColor: '#1e293b',
    tertiaryColor: '#0f172a',
    fontFamily: 'inherit',
    fontSize: '13px',
  },
});

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const chartId = useRef(`mermaid_${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      try {
        setError(null);
        const cleanChart = chart.trim();
        const { svg } = await mermaid.render(chartId.current, cleanChart);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn('[Mermaid render error]:', err);
          setError('Failed to render visual diagram.');
        }
      }
    };

    renderChart();
    return () => {
      isMounted = false;
    };
  }, [chart]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-2xl bg-[#09101d] border border-white/10 overflow-hidden shadow-xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0d1627] border-b border-white/5 text-xs text-gray-400">
        <span className="font-semibold text-[11px] text-[#00F0FF] flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse"></span>
          <span>Interactive Visual Diagram</span>
        </span>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setZoom(z => Math.min(z + 0.15, 2.0))}
            className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.15, 0.6))}
            className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCopyCode}
            className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-white transition-colors ml-1"
            title="Copy Mermaid Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00F0FF]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Body */}
      <div 
        ref={containerRef}
        className="p-4 overflow-x-auto overflow-y-hidden flex items-center justify-center min-h-[140px] bg-radial from-[#00F0FF]/5 via-transparent to-transparent"
      >
        {error ? (
          <div className="text-center p-3">
            <p className="text-xs text-red-400 mb-2">{error}</p>
            <pre className="text-[10px] font-mono text-gray-400 bg-black/40 p-2 rounded max-w-sm text-left overflow-x-auto">
              {chart}
            </pre>
          </div>
        ) : svgContent ? (
          <div 
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.15s ease-out' }}
            dangerouslySetInnerHTML={{ __html: svgContent }} 
            className="w-full flex justify-center [&_svg]:max-w-full [&_svg]:h-auto"
          />
        ) : (
          <div className="flex items-center space-x-2 text-xs text-gray-500 py-6">
            <div className="w-3.5 h-3.5 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin"></div>
            <span>Generating visual layout...</span>
          </div>
        )}
      </div>
    </div>
  );
};
