import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathFormattedTextProps {
  text: string;
  className?: string;
  block?: boolean;
}

export const MathFormattedText: React.FC<MathFormattedTextProps> = ({ text, className = '', block = false }) => {
  if (!text) return null;

  const renderMathContent = (content: string) => {
    // Check if string contains LaTeX math commands like \frac, \sqrt, \int, \cdot, \pm, \theta, ^, _
    const hasLatex = /\\(frac|sqrt|int|cdot|pm|theta|alpha|beta|gamma|omega|pi|sum|infty|vector)|[\^_\{\}]/.test(content);
    
    if (hasLatex && !content.includes('$')) {
      try {
        const html = katex.renderToString(content, { displayMode: block, throwOnError: false });
        return <span dangerouslySetInnerHTML={{ __html: html }} />;
      } catch {
        return content;
      }
    }

    // Process mixed text with inline $...$ or $$...$$
    const parts = content.split(/(\$\$[\s\S]*?\$\$|\$.*?\$)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const expr = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(expr, { displayMode: true, throwOnError: false });
          return <div key={idx} className="my-2 overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />;
        } catch {
          return <span key={idx}>{part}</span>;
        }
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const expr = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(expr, { displayMode: false, throwOnError: false });
          return <span key={idx} dangerouslySetInnerHTML={{ __html: html }} />;
        } catch {
          return <span key={idx}>{part}</span>;
        }
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return <div className={`inline-block ${className}`}>{renderMathContent(text)}</div>;
};
