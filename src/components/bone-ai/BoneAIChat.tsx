import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Plus, 
  Volume2, 
  Square, 
  X, 
  ChevronDown, 
  RefreshCw, 
  Copy, 
  Check, 
  FileText, 
  Mic, 
  MicOff, 
  ThumbsUp, 
  ThumbsDown,
  Sparkles,
  Search,
  BookOpen,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatMessage } from '../../services/chatHistoryStore';
import { aiService } from '../../services/aiService';
import { MermaidViewer } from './MermaidViewer';

interface BoneAIChatProps {
  messages: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
  onUpdateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  currentRoute: string;
}

const MODES = [
  { name: 'Smart', desc: 'Fast, direct answers', icon: Sparkles },
  { name: 'Think Deeper', desc: 'Deep step-by-step reasoning', icon: Brain },
  { name: 'Study & Learn', desc: 'Personal private tutor', icon: BookOpen },
  { name: 'Google Search', desc: 'Real-time web information', icon: Search },
];

export const BoneAIChat: React.FC<BoneAIChatProps> = ({ messages, onAddMessage, onUpdateMessage, currentRoute }) => {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState('Smart');
  const [isModeOpen, setIsModeOpen] = useState(false);
  const [attachment, setAttachment] = useState<{ file: File; base64: string; type: 'image' | 'pdf' } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Speech response toggle
  const toggleSpeech = (text: string, messageId: string) => {
    if (!window.speechSynthesis) return;
    
    if (speakingId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    
    window.speechSynthesis.cancel();
    
    // Sanitize message content from symbols or citation links before speaking
    const sanitizedText = text.replace(/\[\d+\]/g, '').replace(/[*#`_-]/g, '').trim();
    
    const utterance = new SpeechSynthesisUtterance(sanitizedText);
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || voices.find(v => v.lang.startsWith('en'));
    if (naturalVoice) utterance.voice = naturalVoice;
    
    utterance.onend = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
    setSpeakingId(messageId);
  };

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition failed to start:', err);
      setIsListening(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Maximum file size is 10 MB');
      return;
    }

    const isPdf = file.type === 'application/pdf';
    const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);

    if (!isImage && !isPdf) {
      alert('Only JPG, PNG, WebP, and PDF formats are supported');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAttachment({ file, base64: event.target.result as string, type: isPdf ? 'pdf' : 'image' });
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText !== undefined ? customText : inputText.trim();
    if ((!textToSend && !attachment) || isGenerating) return;

    const userMsgId = Date.now().toString();
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
      image: attachment?.type === 'image' ? attachment.base64 : undefined,
      filename: attachment?.file.name
    } as any;
    onAddMessage(userMsg);
    
    const currentText = textToSend;
    const currentMode = mode;
    const currentAttachment = attachment ? { data: attachment.base64, mimeType: attachment.file.type, filename: attachment.file.name } : undefined;
    
    // Pass previous turns for conversation memory
    const historyPayload = messages
      .filter(m => m.content && m.content !== '...')
      .slice(-8)
      .map(m => ({ role: m.role, content: m.content }));

    setInputText('');
    setAttachment(null);
    setIsGenerating(true);

    const botMsgId = (Date.now() + 1).toString();
    const botMsg: ChatMessage = {
      id: botMsgId,
      role: 'assistant',
      content: '...',
      timestamp: Date.now(),
      mode: currentMode
    };
    onAddMessage(botMsg);

    try {
      const payload: any = {
        message: currentText,
        mode: currentMode,
        attachment: currentAttachment,
        history: historyPayload,
        conversationId: 'default',
        assistantContext: {
          currentRoute,
          permittedContent: []
        }
      };
      const response = await aiService.sendMessage(payload);
      if (response.error) {
        onUpdateMessage(botMsgId, { content: response.error });
      } else {
        onUpdateMessage(botMsgId, { 
          content: response.answer,
          citations: response.citations
        });
      }
    } catch (err: any) {
      onUpdateMessage(botMsgId, { content: 'Bone AI is temporarily unavailable. Please try again shortly.' });
    } finally {
      setIsGenerating(false);
    }
  };

  // Safe Text Formatter (Sanitized inline renderer, prevents custom/raw HTML injection)
  // Safe Text Formatter (Enhanced with Mermaid, Visual Images, Tables, and Math)
  const renderFormattedText = (text: string) => {
    if (text === '...') {
      return (
        <div className="flex space-x-1.5 items-center h-6 py-2">
          <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      );
    }

    // Split text by fenced code blocks (```mermaid or ```lang)
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const segments: React.ReactNode[] = [];
    let lastIdx = 0;
    let blockMatch: RegExpExecArray | null;

    const parseMathToJSX = (mathText: string): React.ReactNode => {
      let clean = mathText.replace(/\\text\{([^}]+)\}/g, '$1');
      const tokens: React.ReactNode[] = [];
      let i = 0;
      while (i < clean.length) {
        if (clean[i] === '_') {
          i++;
          if (clean[i] === '{') {
            const close = clean.indexOf('}', i);
            if (close !== -1) {
              tokens.push(<sub key={i} className="text-[11px] text-[#00F0FF] font-mono">{clean.slice(i + 1, close)}</sub>);
              i = close + 1;
              continue;
            }
          } else if (clean[i]) {
            tokens.push(<sub key={i} className="text-[11px] text-[#00F0FF] font-mono">{clean[i]}</sub>);
            i++;
            continue;
          }
        } else if (clean[i] === '^') {
          i++;
          if (clean[i] === '{') {
            const close = clean.indexOf('}', i);
            if (close !== -1) {
              tokens.push(<sup key={i} className="text-[11px] text-[#00F0FF] font-mono">{clean.slice(i + 1, close)}</sup>);
              i = close + 1;
              continue;
            }
          } else if (clean[i]) {
            tokens.push(<sup key={i} className="text-[11px] text-[#00F0FF] font-mono">{clean[i]}</sup>);
            i++;
            continue;
          }
        }
        tokens.push(clean[i]);
        i++;
      }
      return tokens;
    };

    const parseInlineFormatting = (line: string): React.ReactNode => {
      const parts: React.ReactNode[] = [];
      const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]+?\$|\*\*[^*]+?\*\*|\*[^*]+?\*|`[^`]+?`|!\[([^\]]*?)\]\((https?:\/\/[^\s\)]+)\))/g;
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }

        const token = match[0];
        
        // Markdown Image Embed ![alt](url)
        if (token.startsWith('![') && match[2] && match[3]) {
          const altText = match[2];
          const imgUrl = match[3];
          parts.push(
            <div key={match.index} className="my-3 rounded-2xl overflow-hidden border border-white/10 bg-[#070d18] shadow-2xl group">
              <div className="relative">
                <img 
                  src={imgUrl} 
                  alt={altText} 
                  className="w-full max-h-80 object-contain bg-black/60 rounded-t-2xl" 
                  loading="lazy" 
                />
                <div className="p-2.5 bg-[#091120] border-t border-white/5 flex items-center justify-between">
                  <span className="text-[#00F0FF] font-semibold text-xs truncate max-w-[240px] flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]"></span>
                    <span>{altText || 'Generated Visual Illustration'}</span>
                  </span>
                  <a 
                    href={imgUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[10px] text-gray-300 hover:text-white px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center space-x-1 font-medium"
                  >
                    <span>View HD</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>
          );
        } else if (token.startsWith('$$') && token.endsWith('$$')) {
          const math = token.slice(2, -2);
          parts.push(
            <span key={match.index} className="font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-1.5 py-0.5 rounded text-xs font-semibold">
              {parseMathToJSX(math)}
            </span>
          );
        } else if (token.startsWith('$') && token.endsWith('$')) {
          const math = token.slice(1, -1);
          parts.push(
            <span key={match.index} className="font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-1.5 py-0.5 rounded text-xs font-semibold">
              {parseMathToJSX(math)}
            </span>
          );
        } else if (token.startsWith('**') && token.endsWith('**')) {
          parts.push(
            <strong key={match.index} className="font-semibold text-white">
              {token.slice(2, -2)}
            </strong>
          );
        } else if (token.startsWith('*') && token.endsWith('*')) {
          parts.push(
            <em key={match.index} className="italic text-gray-200">
              {token.slice(1, -1)}
            </em>
          );
        } else if (token.startsWith('`') && token.endsWith('`')) {
          parts.push(
            <code key={match.index} className="font-mono text-xs text-[#00F0FF] bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
              {token.slice(1, -1)}
            </code>
          );
        }
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return parts;
    };

    const renderTextSegment = (textChunk: string, keyPrefix: string) => {
      const paragraphs = textChunk.split(/\n\s*\n/);

      return paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');

        // Check if paragraph is a markdown table
        if (lines.length >= 2 && lines[0].includes('|') && lines[1].includes('|')) {
          const headerCells = lines[0].split('|').filter(c => c.trim() !== '');
          const rows = lines.slice(2).map(r => r.split('|').filter(c => c.trim() !== ''));

          return (
            <div key={`${keyPrefix}_tbl_${pIdx}`} className="my-2.5 overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs border-collapse bg-[#0c1424]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-[#00F0FF]">
                    {headerCells.map((h, hIdx) => (
                      <th key={hIdx} className="px-3 py-2 font-bold">{parseInlineFormatting(h.trim())}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3 py-1.5 text-gray-200">{parseInlineFormatting(cell.trim())}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return lines.map((line, lIdx) => {
          const cleanLine = line.trim();
          if (!cleanLine) return null;

          if (cleanLine.startsWith('### ')) {
            return (
              <h4 key={`${keyPrefix}_${pIdx}_${lIdx}`} className="text-sm font-bold text-[#00F0FF] tracking-wide mt-3 mb-1.5 flex items-center">
                {parseInlineFormatting(cleanLine.replace(/^###\s+/, ''))}
              </h4>
            );
          }
          if (cleanLine.startsWith('## ')) {
            return (
              <h3 key={`${keyPrefix}_${pIdx}_${lIdx}`} className="text-base font-bold text-white tracking-wide mt-3.5 mb-2">
                {parseInlineFormatting(cleanLine.replace(/^##\s+/, ''))}
              </h3>
            );
          }
          if (cleanLine.startsWith('# ')) {
            return (
              <h2 key={`${keyPrefix}_${pIdx}_${lIdx}`} className="text-lg font-extrabold text-white tracking-tight mt-4 mb-2">
                {parseInlineFormatting(cleanLine.replace(/^#\s+/, ''))}
              </h2>
            );
          }

          if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ') || cleanLine.startsWith('• ')) {
            return (
              <div key={`${keyPrefix}_${pIdx}_${lIdx}`} className="flex items-start space-x-2 my-1 text-xs text-gray-200 pl-1 leading-relaxed">
                <span className="text-[#00F0FF] mt-1 text-[8px]">●</span>
                <div className="flex-1">{parseInlineFormatting(cleanLine.replace(/^[-*•]\s+/, ''))}</div>
              </div>
            );
          }

          const numMatch = cleanLine.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={`${keyPrefix}_${pIdx}_${lIdx}`} className="flex items-start space-x-2 my-1 text-xs text-gray-200 pl-1 leading-relaxed">
                <span className="text-[#00F0FF] font-mono font-bold text-xs">{numMatch[1]}.</span>
                <div className="flex-1">{parseInlineFormatting(numMatch[2])}</div>
              </div>
            );
          }

          return (
            <p key={`${keyPrefix}_${pIdx}_${lIdx}`} className="text-xs text-gray-200 leading-relaxed select-text my-1">
              {parseInlineFormatting(cleanLine)}
            </p>
          );
        });
      });
    };

    while ((blockMatch = codeBlockRegex.exec(text)) !== null) {
      if (blockMatch.index > lastIdx) {
        const textBefore = text.substring(lastIdx, blockMatch.index);
        segments.push(renderTextSegment(textBefore, `pre_${lastIdx}`));
      }

      const lang = (blockMatch[1] || '').trim().toLowerCase();
      const code = (blockMatch[2] || '').trim();

      if (lang === 'mermaid' || (!lang && (code.startsWith('graph ') || code.startsWith('flowchart ')))) {
        // Render interactive Mermaid Flowchart/Diagram
        segments.push(<MermaidViewer key={`mermaid_${blockMatch.index}`} chart={code} />);
      } else {
        // Render standard syntax code block
        segments.push(
          <div key={`code_${blockMatch.index}`} className="my-2.5 rounded-xl bg-[#090f1d] border border-white/10 overflow-hidden shadow-md">
            {lang && (
              <div className="px-3 py-1 bg-white/5 border-b border-white/5 text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider">
                {lang}
              </div>
            )}
            <pre className="p-3 text-xs font-mono text-gray-200 overflow-x-auto">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      lastIdx = codeBlockRegex.lastIndex;
    }

    if (lastIdx < text.length) {
      segments.push(renderTextSegment(text.substring(lastIdx), `post_${lastIdx}`));
    }

    return segments;
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-premium">
        {/* Date Divider (Copilot-Style) */}
        <div className="flex items-center justify-center mb-3">
          <div className="h-px bg-white/[0.06] flex-1"></div>
          <span className="px-3 text-[10px] text-gray-500 font-medium tracking-wider">Today</span>
          <div className="h-px bg-white/[0.06] flex-1"></div>
        </div>

        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8 space-y-5">
            {/* Avatar Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-violet-600/20 to-cyan-500/10 border border-white/10 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-[15px] font-bold text-white tracking-tight">How can I help you today?</h3>
              <p className="text-[12px] text-gray-400 max-w-[240px] leading-relaxed">
                Ask about JEE, NEET, solve problems, analyze diagrams, or explore concepts.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-1.5 w-full mt-1">
              {[
                'Explain Newton’s laws of motion',
                'What is the structure of DNA?',
                'Who is the father of biotechnology?',
                'Help me solve a calculus problem'
              ].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="w-full px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] hover:border-white/[0.14] rounded-2xl text-[12px] text-left text-gray-300 hover:text-white transition-all flex items-center justify-between group"
                >
                  <span>{prompt}</span>
                  <span className="text-gray-600 group-hover:text-gray-300 text-[10px] shrink-0 ml-2">↗</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="space-y-1">
              {msg.role === 'user' ? (
                /* User Message — Copilot right-aligned bubble */
                <div className="flex justify-end">
                  <div className="max-w-[82%] bg-[#1e2535] border border-white/[0.08] text-white rounded-[20px] rounded-tr-md px-4 py-3 shadow-sm">
                    {msg.image && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-white/10">
                        <img src={msg.image} alt="Upload" className="max-h-40 w-auto object-contain" />
                      </div>
                    )}
                    {(msg as any).filename && (
                      <div className="flex items-center space-x-1.5 text-xs text-[#00F0FF] mb-1 font-mono">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[180px]">{(msg as any).filename}</span>
                      </div>
                    )}
                    <p className="text-[12px] text-gray-100 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ) : (
                /* Assistant Message — Copilot style left-aligned */
                <div className="flex justify-start">
                  <div className="w-full space-y-2 py-1">
                    <div className="text-[12px] text-gray-200 leading-relaxed select-text space-y-1">
                      {renderFormattedText(msg.content)}
                    </div>

                    {/* Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-white/5">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 mb-1.5 block">Verified Sources</span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.citations.map((cite, i) => (
                            <a 
                              key={i} 
                              href={cite.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center space-x-1 px-2.5 py-1 bg-white/5 hover:bg-[#00F0FF]/10 hover:text-[#00F0FF] rounded-lg text-[10px] text-gray-300 border border-white/5 transition-all"
                            >
                              <span className="truncate max-w-[140px] font-medium">{cite.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Copilot-Style Action Icons Bar */}
                    {msg.content !== '...' && (
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex items-center space-x-1">
                          {/* Feedback Thumbs */}
                          <button
                            onClick={() => setFeedback(prev => ({ ...prev, [msg.id]: 'up' }))}
                            className={`p-1.5 rounded-lg transition-colors ${feedback[msg.id] === 'up' ? 'text-[#00F0FF] bg-[#00F0FF]/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            title="Helpful"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setFeedback(prev => ({ ...prev, [msg.id]: 'down' }))}
                            className={`p-1.5 rounded-lg transition-colors ${feedback[msg.id] === 'down' ? 'text-red-400 bg-red-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            title="Not helpful"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                          {/* Copy */}
                          <button 
                            onClick={() => handleCopy(msg.content, msg.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            title="Copy text"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-[#00F0FF]" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          {/* Text-to-speech */}
                          <button 
                            onClick={() => toggleSpeech(msg.content, msg.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            title={speakingId === msg.id ? "Stop reading" : "Read aloud"}
                          >
                            {speakingId === msg.id ? <Square className="w-3.5 h-3.5 text-[#00F0FF]" /> : <Volume2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Mode Badge */}
                        {msg.mode && (
                          <span className="text-[9px] uppercase tracking-wider font-semibold text-gray-400 px-2 py-0.5 bg-white/5 rounded-md border border-white/5">
                            {msg.mode}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-white/[0.06] shrink-0">
        {/* Attachment preview */}
        <AnimatePresence>
          {attachment && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mb-2 p-2.5 bg-white/[0.04] border border-white/[0.08] rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center space-x-2 min-w-0">
                {attachment.type === 'image' ? (
                  <img src={attachment.base64} alt="Attachment" className="h-10 w-10 object-cover rounded-lg border border-white/10" />
                ) : (
                  <div className="h-10 w-10 bg-white/5 rounded-lg flex items-center justify-center text-[#00F0FF]">
                    <FileText className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs text-white font-medium truncate max-w-[200px]">{attachment.file.name}</p>
                  <p className="text-[10px] text-gray-400">{(attachment.file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button 
                onClick={() => setAttachment(null)}
                className="p-1 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Capsule */}
        <div className="bg-[#1a1e2a] border border-white/[0.08] rounded-[22px] p-3 focus-within:border-white/[0.16] transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/jpeg, image/png, image/webp, application/pdf"
            className="hidden"
          />

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Message Bone AI or ask a question..."
            className="w-full bg-transparent border-0 text-white text-[13px] placeholder:text-gray-500 focus:outline-none resize-none min-h-[36px] max-h-28 px-0 leading-relaxed"
            rows={1}
          />

          {/* Action Bar */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06]">
            {/* Left: + and Mode */}
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all border border-white/[0.08]"
                title="Attach Image or PDF"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              {/* Mode Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsModeOpen(!isModeOpen)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.10] rounded-full text-[12px] font-medium text-gray-300 border border-white/[0.08] transition-all"
                >
                  <span>{mode}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                <AnimatePresence>
                  {isModeOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsModeOpen(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute bottom-full left-0 mb-2 w-56 bg-[#1c2030] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-20 p-1.5 space-y-0.5"
                      >
                        {MODES.map(m => {
                          const Icon = m.icon;
                          const isSelected = mode === m.name;
                          return (
                            <button
                              key={m.name}
                              type="button"
                              onClick={() => { setMode(m.name); setIsModeOpen(false); }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center space-x-2.5 ${
                                isSelected ? 'bg-[#00F0FF]/15 text-[#00F0FF] font-semibold' : 'text-gray-300 hover:bg-white/5'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium leading-none">{m.name}</p>
                                <p className="text-[9px] text-gray-400 mt-0.5 truncate">{m.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Mic + Send */}
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.08]'
                }`}
                title={isListening ? 'Listening… click to stop' : 'Voice input'}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={isGenerating || (!inputText.trim() && !attachment)}
                className="w-8 h-8 rounded-full bg-[#00D4E8] hover:bg-[#00F0FF] text-[#0a0c14] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_2px_12px_rgba(0,240,255,0.3)]"
                title="Send"
              >
                {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
