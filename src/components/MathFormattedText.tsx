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
    // 1. If explicit $ or $$ are present, process mixed text with $...$ or $$...$$
    if (content.includes('$')) {
      const parts = content.split(/(\$\$[\s\S]*?\$\$|\$.*?\$)/g);
      return parts.map((part, idx) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const expr = part.slice(2, -2).trim();
          try {
            const html = katex.renderToString(expr, { displayMode: true, throwOnError: false });
            return <div key={idx} className="my-2 max-w-full overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />;
          } catch {
            return <span key={idx}>{part}</span>;
          }
        } else if (part.startsWith('$') && part.endsWith('$')) {
          const expr = part.slice(1, -1).trim();
          try {
            const html = katex.renderToString(expr, { displayMode: false, throwOnError: false });
            return <span key={idx} className="max-w-full overflow-x-auto inline-block align-middle" dangerouslySetInnerHTML={{ __html: html }} />;
          } catch {
            return <span key={idx}>{part}</span>;
          }
        }
        return <span key={idx}>{part}</span>;
      });
    }

    // 2. If no $ delimiters are present:
    const hasLatex = /\\(frac|sqrt|int|cdot|pm|theta|alpha|beta|gamma|omega|pi|sum|infty|vector|vec|cot|implies|hat|text)|[\^_\{\}]/.test(content);
    
    if (!hasLatex) {
      return <span>{content}</span>;
    }

    // Process line by line to preserve line breaks and separate plain prose from math equations
    const lines = content.split('\n');
    return lines.map((line, lineIdx) => {
      const lineHasLatex = /\\(frac|sqrt|int|cdot|pm|theta|alpha|beta|gamma|omega|pi|sum|infty|vector|vec|cot|implies|hat|text)|[\^_\{\}]/.test(line);
      
      if (!lineHasLatex) {
        return (
          <div key={lineIdx} className={lineIdx > 0 ? 'mt-1.5' : ''}>
            {line}
          </div>
        );
      }

      // Auto-wrap LaTeX equation fragments in $...$ so plain words retain normal spacing
      const formattedLine = line.replace(/(\\[a-zA-Z]+(?:\{[^{}]*\}|\^\{[^{}]*\}|_[^{}]*\}|[^{}\s])*(?:\s*=\s*(?:\\[a-zA-Z]+(?:\{[^{}]*\}|.)+|[^\s,.]+))?|[a-zA-Z0-9_]+\s*=\s*\\[a-zA-Z]+(?:\{[^{}]*\}|.)+)/g, (match) => {
        return `$${match}$`;
      });

      if (formattedLine.includes('$')) {
        return (
          <div key={lineIdx} className={lineIdx > 0 ? 'mt-1.5' : ''}>
            {renderMathContent(formattedLine)}
          </div>
        );
      }

      try {
        const html = katex.renderToString(line, { displayMode: block, throwOnError: false });
        return <div key={lineIdx} className={`max-w-full overflow-x-auto ${lineIdx > 0 ? 'mt-1.5' : ''}`} dangerouslySetInnerHTML={{ __html: html }} />;
      } catch {
        return <div key={lineIdx} className={lineIdx > 0 ? 'mt-1.5' : ''}>{line}</div>;
      }
    });
  };

  return <div className={`w-full max-w-full overflow-x-auto leading-relaxed ${className}`}>{renderMathContent(text)}</div>;
};
