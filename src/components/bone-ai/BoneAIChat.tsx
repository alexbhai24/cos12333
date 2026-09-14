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
  Brain,
  Menu,
  Link2,
  FileUp,
  Download,
  Maximize2,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatMessage } from '../../services/chatHistoryStore';
import { aiService, shouldUseWebSearch } from '../../services/aiService';
import { MermaidViewer } from './MermaidViewer';
import { MessagePlusIcon } from './MessagePlusIcon';
import { BixbyMicIcon } from './BixbyMicIcon';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface BoneAIChatProps {
  messages: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
  onUpdateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  currentRoute: string;
  onToggleSidebar?: () => void;
  onNewChat?: () => void;
  hideHeader?: boolean;
}

const MODES = [
  { name: 'Level 1', desc: 'Short search answers', icon: Search, color: 'text-gray-400', border: 'border-gray-500', bg: 'bg-gray-500/10' },
  { name: 'Level 2', desc: 'Medium responses + Web images', icon: Sparkles, color: 'text-[#00F0FF]', border: 'border-[#00F0FF]/50', bg: 'bg-[#00F0FF]/10' },
  { name: 'Level 3', desc: 'Detailed explanations', icon: BookOpen, color: 'text-[#FFD700]', border: 'border-[#FFD700]/50', bg: 'bg-[#FFD700]/10' },
  { name: 'Level 4', desc: 'Advanced solving + Image generation', icon: Brain, color: 'text-[#FF3366]', border: 'border-[#FF3366]/50', bg: 'bg-[#FF3366]/10' },
];

const NEET_JEE_PYQ_POOL = [
  'Who is the father of biotechnology?',
  "Ohm's law formula and SI units",
  "Le Chatelier's Principle in chemical equilibrium",
  'Light reaction vs Dark reaction in Photosynthesis',
  'Difference between Mitosis and Meiosis cell division',
  'Dimensional formula of Newton and SI unit of force',
  "Bohr's radius formula for Hydrogen atom",
  "Heisenberg's Uncertainty Principle equation",
  'Work energy theorem statement and formula',
  'Hybridization of sp3, sp2 and sp orbitals',
  'Structure and function of Mitochondria',
  "Bernoulli's equation in fluid dynamics",
  "Markovnikov's rule in organic chemistry",
  'Solve integral of sin²(x) dx',
  'Central Dogma of molecular biology',
  "Faraday's laws of electromagnetic induction",
  'Difference between DNA and RNA nucleotide structure',
  'First law of Thermodynamics formula'
];

const getRandomPyqPrompts = () => {
  const shuffled = [...NEET_JEE_PYQ_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

export const BoneAIChat: React.FC<BoneAIChatProps> = ({ 
  messages, 
  onAddMessage, 
  onUpdateMessage, 
  currentRoute,
  onToggleSidebar,
  onNewChat,
  hideHeader = false
}) => {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState('Level 1');
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(getRandomPyqPrompts);

  useEffect(() => {
    if (messages.length === 0) {
      setSuggestedPrompts(getRandomPyqPrompts());
    }
  }, [messages.length]);

  const cycleMode = () => {
    const currentIndex = MODES.findIndex(m => m.name === mode);
    const nextIndex = (currentIndex + 1) % MODES.length;
    setMode(MODES[nextIndex].name);
  };
  const [attachment, setAttachment] = useState<{ file: File; base64: string; type: 'image' | 'pdf' } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const [openSourcesMap, setOpenSourcesMap] = useState<Record<string, boolean>>({});
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusState, setStatusState] = useState<'idle' | 'searching_web' | 'thinking' | 'completed' | 'cancelled' | 'error'>('idle');
  const [toolBoxOpen, setToolBoxOpen] = useState(false);
  const [fullViewSvg, setFullViewSvg] = useState<string | null>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toolBoxRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleDownloadSvg = (svgContent: string, filename = 'bone_ai_illustration.svg') => {
    try {
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download SVG:', err);
    }
  };

  // Close toolbox when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolBoxRef.current && !toolBoxRef.current.contains(event.target as Node)) {
        setToolBoxOpen(false);
      }
    };
    if (toolBoxOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toolBoxOpen]);

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
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const err = 'Voice search is not supported in this browser.';
      setSpeechError(err);
      setStatusMessage(err);
      setTimeout(() => {
        setSpeechError(null);
        setStatusMessage(null);
      }, 3500);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setStatusMessage('Voice recognition stopped.');
      setTimeout(() => setStatusMessage(null), 2500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
        setStatusMessage('Listening for voice input...');
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
        let errMsg = 'Voice recognition error occurred.';
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          errMsg = 'Microphone permission denied.';
        } else if (event.error === 'no-speech') {
          errMsg = 'No speech detected.';
        }
        setSpeechError(errMsg);
        setStatusMessage(errMsg);
        setTimeout(() => {
          setSpeechError(null);
          setStatusMessage(null);
        }, 3500);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition failed to start:', err);
      setIsListening(false);
      const errMsg = 'Failed to start voice recognition.';
      setSpeechError(errMsg);
      setStatusMessage(errMsg);
      setTimeout(() => {
        setSpeechError(null);
        setStatusMessage(null);
      }, 3500);
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    setStatusState('cancelled');
    setStatusMessage('AI processing cancelled.');
    setTimeout(() => setStatusMessage(null), 2500);
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

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

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
      .filter(m => m.content && !m.content.startsWith('[image_loading]') && m.content !== '...')
      .slice(-20)
      .map(m => ({ role: m.role, content: m.content }));

    const isWebSearch = shouldUseWebSearch(currentText, currentMode);
    setStatusState(isWebSearch ? 'searching_web' : 'thinking');
    setStatusMessage(isWebSearch ? 'Searching the web for latest sources...' : 'Thinking and generating response...');

    setInputText('');
    setAttachment(null);
    setIsGenerating(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    let initialBotContent = '...';
    if (currentMode === 'Level 4' && /(generate|make|create|draw)\s+(an?\s+)?image/i.test(currentText)) {
      initialBotContent = '[image_loading]';
    }

    const botMsgId = (Date.now() + 1).toString();
    const botMsg: ChatMessage = {
      id: botMsgId,
      role: 'assistant',
      content: initialBotContent,
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
        signal: controller.signal,
        assistantContext: {
          currentRoute,
          permittedContent: []
        }
      };
      const response = await aiService.sendMessage(payload);
      if (response.error) {
        onUpdateMessage(botMsgId, { content: response.error });
        setStatusState('error');
      } else {
        let cleanText = response.answer;
        cleanText = cleanText.replace(/^(###?)\s+/m, '');
        cleanText = cleanText.replace(/\n{3,}/g, '\n\n');

        onUpdateMessage(botMsgId, {
          content: cleanText,
          citations: response.citations,
          webImages: response.webImages,
          followUpSuggestions: response.followUpSuggestions
        });
        setStatusState('completed');
      }
      setStatusMessage('Response generated.');
      setTimeout(() => setStatusMessage(null), 2500);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        onUpdateMessage(botMsgId, { content: 'Request was cancelled by user.' });
        setStatusState('cancelled');
      } else {
        onUpdateMessage(botMsgId, { content: 'Bone AI is temporarily unavailable. Please try again shortly.' });
        setStatusState('error');
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  // Safe Text Formatter (Sanitized inline renderer, prevents custom/raw HTML injection)
  const renderFormattedText = (text: string) => {
    if (text === '...') {
      const lastUserMsg = messages.slice().reverse().find(m => m.role === 'user')?.content || 'the request';
      const shortContext = lastUserMsg.length > 60 ? lastUserMsg.substring(0, 60) + '...' : lastUserMsg;

      if (statusState === 'searching_web') {
        return (
          <div className="flex flex-col font-mono text-[11px] leading-relaxed py-1">
            <div className="flex items-center space-x-2 text-[#00F0FF]">
              <Search className="w-3.5 h-3.5 animate-spin text-[#00F0FF]" />
              <span className="animate-pulse">Searching the web for latest sources...</span>
            </div>
            <span className="text-[10px] text-gray-500 mt-1">Analyzing context for "{shortContext}"</span>
          </div>
        );
      }

      return (
        <div className="flex flex-col font-mono text-[11px] leading-relaxed py-1">
          <div className="flex items-start space-x-2 text-gray-400">
            <div className="mt-1 flex flex-col items-center">
              <div className="w-1.5 h-1.5 rounded-full border border-gray-500"></div>
              <div className="w-px h-5 border-l border-dashed border-gray-600/50 my-0.5"></div>
            </div>
            <span>Analyzing {shortContext}</span>
          </div>
          <div className="flex items-start space-x-2 text-[#00F0FF]">
            <div className="mt-1.5 flex flex-col items-center">
              <div className="w-1.5 h-1.5 rounded-full border-[1.5px] border-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.6)] animate-pulse"></div>
            </div>
            <span className="animate-pulse">Preparing a concise explanation...</span>
          </div>
        </div>
      );
    }

    if (text === '[image_loading]') {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl space-y-3 animate-pulse">
          <Sparkles className="w-6 h-6 text-[#FF3366]" />
          <span className="text-xs text-gray-400 font-medium tracking-wide">Creating image...</span>
        </div>
      );
    }

    // Split text by fenced code blocks (```mermaid or ```lang)
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const segments: React.ReactNode[] = [];
    let lastIdx = 0;
    let blockMatch: RegExpExecArray | null;
    const renderKaTeX = (latex: string, displayMode: boolean, key: string | number) => {
      try {
        const html = katex.renderToString(latex, {
          displayMode,
          throwOnError: false,
        });
        return (
          <span
            key={key}
            className={displayMode ? "block my-2 text-center text-[#00F0FF] overflow-x-auto py-1" : "inline-block text-[#00F0FF] px-1 font-mono font-medium"}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch (err) {
        return (
          <span key={key} className="font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-1.5 py-0.5 rounded text-xs">
            {latex}
          </span>
        );
      }
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
            <div key={match.index} className="relative my-3 inline-block max-w-full sm:max-w-md rounded-3xl overflow-hidden border border-white/10 bg-[#070d18] shadow-2xl group transition-all">
              <img
                src={imgUrl}
                alt={altText || 'Generated Visual Illustration'}
                className="w-full max-h-[380px] object-cover bg-black/60 rounded-3xl cursor-pointer"
                loading="lazy"
                onClick={() => window.open(imgUrl, '_blank')}
              />

              {/* Overlaid Floating Action Icons (Bottom-Left: See Full, Bottom-Right: Download) */}
              <div className="absolute bottom-3 left-3 z-10">
                <a
                  href={imgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white transition-all transform hover:scale-110 active:scale-95 shadow-xl flex items-center justify-center"
                  title="See Full Image"
                  aria-label="See Full Image"
                >
                  <Maximize2 className="w-4 h-4 text-[#00F0FF]" />
                </a>
              </div>

              <div className="absolute bottom-3 right-3 z-10">
                <a
                  href={imgUrl}
                  download="image_illustration"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white transition-all transform hover:scale-110 active:scale-95 shadow-xl flex items-center justify-center"
                  title="Download Image"
                  aria-label="Download Image"
                >
                  <Download className="w-4 h-4 text-[#00F0FF]" />
                </a>
              </div>
            </div>
          );
        } else if (token.startsWith('$$') && token.endsWith('$$')) {
          const math = token.slice(2, -2);
          parts.push(renderKaTeX(math, true, match.index));
        } else if (token.startsWith('$') && token.endsWith('$')) {
          const math = token.slice(1, -1);
          parts.push(renderKaTeX(math, false, match.index));
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
      } else if (lang === 'svg' || lang === 'xml' || (code.includes('<svg') && code.includes('</svg>'))) {
        const svgMatch = code.match(/<svg[\s\S]*?<\/svg>/i);
        const svgCode = svgMatch ? svgMatch[0] : code;

        segments.push(
          <div key={`svg_${blockMatch.index}`} className="relative my-3 inline-block max-w-full sm:max-w-md rounded-3xl overflow-hidden border border-white/10 bg-[#070d18] shadow-2xl group transition-all">
            {/* Clean SVG Image Container (Cropped without extra top padding) */}
            <div 
              className="p-4 sm:p-5 flex justify-center items-center bg-black/60 cursor-pointer overflow-hidden max-h-[380px]"
              onClick={() => setFullViewSvg(svgCode)}
            >
              <div 
                className="max-w-full max-h-full flex justify-center items-center select-none pointer-events-none"
                dangerouslySetInnerHTML={{ __html: svgCode }}
              />
            </div>

            {/* Overlaid Floating Action Icons (Bottom-Left: See Full, Bottom-Right: Download) */}
            <div className="absolute bottom-3 left-3 z-10">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFullViewSvg(svgCode); }}
                className="p-2.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white transition-all transform hover:scale-110 active:scale-95 shadow-xl flex items-center justify-center"
                title="See Full Image"
                aria-label="See Full Image"
              >
                <Maximize2 className="w-4 h-4 text-[#00F0FF]" />
              </button>
            </div>

            <div className="absolute bottom-3 right-3 z-10">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleDownloadSvg(svgCode); }}
                className="p-2.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white transition-all transform hover:scale-110 active:scale-95 shadow-xl flex items-center justify-center"
                title="Download Image"
                aria-label="Download Image"
              >
                <Download className="w-4 h-4 text-[#00F0FF]" />
              </button>
            </div>
          </div>
        );
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
      {/* Bone AI Header matching user Image 2 */}
      {!hideHeader && (
        <div className="flex items-center justify-between px-4 sm:px-8 pt-4 sm:pt-8 pb-2 shrink-0">
          <div className="flex items-center space-x-3">
            {/* Hamburger button to toggle sliding sidebar on mobile */}
            <button 
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 -ml-1 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors focus:outline-none"
              title="Open navigation menu"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>
            <h1 className="font-sans font-black text-2xl sm:text-3xl tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(168,85,247,0.4)]">
              Bone AI
            </h1>
          </div>
          <button 
            type="button"
            onClick={onNewChat}
            className="w-10 h-10 rounded-full bg-[#272930] hover:bg-[#343740] border border-white/10 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF]"
            title="New conversation"
            aria-label="New conversation"
          >
            <MessagePlusIcon className="w-5 h-5" size={20} />
          </button>
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-2 space-y-3 scrollbar-premium flex flex-col">

        {messages.length === 0 ? (
          /* Bone AI Empty State matching user's Image 2 & Image 3 */
          <div className="flex-1 flex flex-col justify-start items-start space-y-3.5 pt-1">
            <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
              You can say
            </h2>
            <div className="flex flex-col space-y-2.5 items-start w-full max-w-lg">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="px-4 py-2 bg-[#202330]/90 hover:bg-[#2d3244] border border-white/10 backdrop-blur-md rounded-full text-xs sm:text-sm font-medium text-gray-200 hover:text-white transition-all focus:outline-none focus:ring-1 focus:ring-[#00F0FF]/60 shadow-md text-left font-sans cursor-pointer max-w-full truncate"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="space-y-1">
              {msg.role === 'user' ? (
                /* User Message — CosmicBone Cyan Glow Bubble */
                <div className="flex justify-end">
                  <div className="max-w-[82%] bg-[var(--color-cyan)]/15 border border-[var(--color-cyan)]/35 text-white rounded-[20px] rounded-tr-md px-4 py-3 shadow-[0_4px_20px_rgba(0,240,255,0.08)]">
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
                /* Assistant Message — Copilot / Search Image Gallery style left-aligned */
                <div className="flex justify-start">
                  <div className="w-full space-y-2 py-1">

                    {/* Web Images Carousel / Gallery matching user Image 4 */}
                    {msg.webImages && msg.webImages.length > 0 && (
                      <div className="flex items-center space-x-3 overflow-x-auto pb-2 pt-1 my-1.5 scrollbar-none snap-x">
                        {msg.webImages.map((imgUrl, imgIdx) => (
                          <div 
                            key={imgIdx} 
                            className="shrink-0 w-32 sm:w-40 h-28 sm:h-32 rounded-2xl overflow-hidden border border-white/10 bg-[#0a1120] shadow-xl group relative snap-start"
                          >
                            <img 
                              src={imgUrl} 
                              alt={`Web Visual Reference ${imgIdx + 1}`} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLElement).parentElement!.style.display = 'none';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-[12px] text-gray-200 leading-relaxed select-text space-y-1">
                      {renderFormattedText(msg.content)}
                    </div>

                    {/* Action Bar & Single "Sources" Button matching user Image 1 */}
                    {msg.content !== '...' && (
                      <div className="flex flex-col space-y-2 pt-2 border-t border-white/5">
                        <div className="flex items-center justify-between">
                          {/* Single "Sources" Button on Left */}
                          {msg.citations && msg.citations.length > 0 ? (
                            <button
                              type="button"
                              onClick={() => setOpenSourcesMap(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-2 transition-all shadow-md border ${
                                openSourcesMap[msg.id] 
                                  ? 'bg-[#00F0FF]/15 border-[#00F0FF]/50 text-[#00F0FF]' 
                                  : 'bg-[#222533] hover:bg-[#2e3244] border-white/10 text-gray-200'
                              }`}
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                              <span>Sources</span>
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openSourcesMap[msg.id] ? 'rotate-180' : ''}`} />
                            </button>
                          ) : <div />}

                          {/* Right-aligned Actions & Mode Badge */}
                          <div className="flex items-center space-x-1.5">
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

                            {/* Mode Badge */}
                            {msg.mode && (
                              <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md border ${MODES.find(m => m.name === msg.mode)?.bg || 'bg-white/5'
                                } ${MODES.find(m => m.name === msg.mode)?.color || 'text-gray-400'
                                } ${MODES.find(m => m.name === msg.mode)?.border || 'border-white/5'
                                }`}>
                                {msg.mode}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Expandable Sources Card matching user Image 1 */}
                        <AnimatePresence>
                          {msg.citations && msg.citations.length > 0 && openSourcesMap[msg.id] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, y: -5 }}
                              animate={{ opacity: 1, height: 'auto', y: 0 }}
                              exit={{ opacity: 0, height: 0, y: -5 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-[#181a24] border border-white/10 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4 my-2"
                            >
                              {msg.citations.map((cite, i) => {
                                let domainName = cite.domain;
                                if (!domainName && cite.url) {
                                  try {
                                    domainName = new URL(cite.url).hostname.replace('www.', '');
                                  } catch {
                                    domainName = 'web source';
                                  }
                                }
                                return (
                                  <div key={i} className="space-y-1 pb-3 border-b border-white/5 last:border-b-0 last:pb-0">
                                    <a
                                      href={cite.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group block"
                                    >
                                      <h4 className="text-xs sm:text-sm font-semibold text-gray-100 group-hover:text-[#00F0FF] transition-colors leading-snug">
                                        {i + 1}. {cite.title}
                                      </h4>
                                      {cite.snippet && (
                                        <p className="text-[11px] text-gray-400 leading-relaxed mt-1 line-clamp-2 font-sans">
                                          {cite.snippet}
                                        </p>
                                      )}
                                      <div className="text-[11px] text-blue-400 hover:underline font-mono mt-1 flex items-center space-x-1">
                                        <span>{domainName || cite.url}</span>
                                        <span className="text-[10px]">↗</span>
                                      </div>
                                    </a>
                                  </div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Interactive Follow-up Question Chips */}
                    {msg.followUpSuggestions && msg.followUpSuggestions.length > 0 && msg.content !== '...' && (
                      <div className="mt-2.5 pt-2 border-t border-white/5 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Suggested Follow-ups</span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.followUpSuggestions.map((suggestion, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => handleSend(suggestion)}
                              className="px-2.5 py-1.5 bg-white/[0.04] hover:bg-[#00F0FF]/10 border border-white/[0.08] hover:border-[#00F0FF]/40 text-gray-300 hover:text-white rounded-xl text-[11px] transition-all flex items-center space-x-1 group text-left"
                            >
                              <span className="truncate max-w-[280px]">{suggestion}</span>
                              <span className="text-[#00F0FF] opacity-70 group-hover:opacity-100 font-bold ml-1">→</span>
                            </button>
                          ))}
                        </div>
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

      {/* ARIA Status Announcer */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {statusMessage || ''}
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-white/[0.06] shrink-0">
        {/* Inline Speech Error Toast */}
        <AnimatePresence>
          {speechError && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="mb-2 px-3 py-1.5 bg-red-500/15 border border-red-500/30 rounded-xl text-[11px] text-red-400 flex items-center justify-between"
              role="alert"
            >
              <span>{speechError}</span>
              <button onClick={() => setSpeechError(null)} className="text-red-400 hover:text-white ml-2">
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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

        {/* Link Input Banner */}
        <AnimatePresence>
          {showLinkInput && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="mb-2 p-2 bg-[#121624] border border-[#00F0FF]/30 rounded-2xl flex items-center gap-2 shadow-lg"
            >
              <Link2 className="w-4 h-4 text-[#00F0FF] ml-1 shrink-0" />
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Paste web link or article URL..."
                className="flex-1 bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (linkUrl.trim()) {
                      setInputText((prev) => (prev ? `${prev} ${linkUrl.trim()}` : `Please analyze this link: ${linkUrl.trim()}`));
                      setLinkUrl('');
                      setShowLinkInput(false);
                      textareaRef.current?.focus();
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (linkUrl.trim()) {
                    setInputText((prev) => (prev ? `${prev} ${linkUrl.trim()}` : `Please analyze this link: ${linkUrl.trim()}`));
                    setLinkUrl('');
                    setShowLinkInput(false);
                    textareaRef.current?.focus();
                  }
                }}
                disabled={!linkUrl.trim()}
                className="px-2.5 py-1 bg-[#00F0FF] hover:bg-[#00D4E8] text-[#080b12] text-[11px] font-bold rounded-xl disabled:opacity-40 transition-colors"
              >
                Add Link
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLinkInput(false);
                  setLinkUrl('');
                }}
                className="p-1 text-gray-400 hover:text-white"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Capsule with Interaction Glows */}
        <div
          className={`relative transition-all rounded-[22px] p-3 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.3)] ${isListening
            ? 'bg-[var(--bg-surface-secondary)]/80 border bone-ai-listening-glow'
            : isGenerating
              ? 'bg-[var(--bg-surface-secondary)]/80 border bone-ai-thinking-ring'
              : 'bg-[var(--bg-surface-secondary)]/70 border border-white/15 focus-within:border-[var(--color-cyan)]/50 focus-within:shadow-[0_0_20px_rgba(0,240,255,0.15)]'
            }`}
        >
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
            placeholder={
              isListening
                ? 'Listening…'
                : statusState === 'searching_web'
                  ? 'Searching the web…'
                  : isGenerating
                    ? 'Thinking…'
                    : 'Message Bone AI or ask a question...'
            }
            className="w-full bg-transparent border-0 text-white text-[13px] placeholder:text-gray-500 focus:outline-none resize-none min-h-[36px] max-h-28 px-0 leading-relaxed"
            rows={1}
          />

          {/* Action Bar */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06]">
            {/* Left: Toolbox (+) and Mode (De-emphasized during listening) */}
            <div className={`flex items-center space-x-1.5 transition-opacity ${isListening ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="relative" ref={toolBoxRef}>
                <button
                  type="button"
                  onClick={() => setToolBoxOpen(!toolBoxOpen)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] ${
                    toolBoxOpen
                      ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]/50 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.08] border-white/[0.08]'
                  }`}
                  title="Toolbox: Attach file or web link"
                  aria-label="Toolbox"
                >
                  <Plus className={`w-3.5 h-3.5 transition-transform duration-200 ${toolBoxOpen ? 'rotate-45' : ''}`} />
                </button>

                {/* Toolbox Popup Menu */}
                <AnimatePresence>
                  {toolBoxOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: -6, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full left-0 mb-2 w-48 bg-[#121624] border border-white/10 rounded-2xl p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl z-50 flex flex-col gap-1"
                    >
                      <div className="px-2.5 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Toolbox
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setToolBoxOpen(false);
                          fileInputRef.current?.click();
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs text-gray-200 hover:text-white hover:bg-white/[0.08] transition-colors"
                      >
                        <FileUp className="w-4 h-4 text-[#00F0FF]" />
                        <span>Upload File / PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setToolBoxOpen(false);
                          setShowLinkInput(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs text-gray-200 hover:text-white hover:bg-white/[0.08] transition-colors"
                      >
                        <Link2 className="w-4 h-4 text-emerald-400" />
                        <span>Insert Web Link</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Think Toggle Button */}
              <button
                type="button"
                onClick={cycleMode}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all border ${MODES.find(m => m.name === mode)?.bg || 'bg-white/[0.06]'
                  } ${MODES.find(m => m.name === mode)?.color || 'text-gray-300'
                  } ${MODES.find(m => m.name === mode)?.border || 'border-white/[0.08]'
                  } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF]`}
                title={`Current Mode: ${mode} - ${MODES.find(m => m.name === mode)?.desc} (Click to change)`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Think</span>
              </button>
            </div>

            {/* Right: Voice Equalizer / Cancel Stop / Send */}
            <div className="flex items-center space-x-1.5">
              {isListening ? (
                /* Listening Equalizer Bar Icon */
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className="w-8 h-8 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] flex items-center justify-center space-x-[2px] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF]"
                  title="Listening… click to stop"
                  aria-label="Stop listening"
                >
                  <div className="w-0.5 bg-[#00F0FF] rounded-full bone-ai-eq-bar-1" />
                  <div className="w-0.5 bg-[#00F0FF] rounded-full bone-ai-eq-bar-2" />
                  <div className="w-0.5 bg-[#00F0FF] rounded-full bone-ai-eq-bar-3" />
                  <div className="w-0.5 bg-[#00F0FF] rounded-full bone-ai-eq-bar-4" />
                </button>
              ) : isGenerating ? (
                /* Thinking Square Cancel / Stop Button */
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-white border border-red-500/40 flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  title="Cancel processing"
                  aria-label="Cancel processing"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              ) : (
                /* Bixby Microphone Icon */
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08] hover:border-white/20 transition-all hover:scale-105 active:scale-95 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF]"
                  title="Start voice search"
                  aria-label="Start voice search"
                >
                  <BixbyMicIcon className="w-5 h-5" size={20} />
                </button>
              )}

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={isGenerating || (!inputText.trim() && !attachment)}
                className="w-8 h-8 rounded-full bg-[#00D4E8] hover:bg-[#00F0FF] text-[#0a0c14] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_2px_12px_rgba(0,240,255,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF]"
                title="Send"
                aria-label="Send message"
              >
                {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Image Full Screen Lightbox Modal */}
      <AnimatePresence>
        {fullViewSvg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setFullViewSvg(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full bg-[#091120] border border-[#00F0FF]/40 rounded-3xl p-6 sm:p-8 overflow-auto flex flex-col items-center justify-center shadow-[0_0_60px_rgba(0,240,255,0.25)]"
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setFullViewSvg(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                title="Close full view"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-full flex justify-center items-center p-2 sm:p-6 overflow-auto">
                <div 
                  className="max-w-full flex justify-center items-center"
                  dangerouslySetInnerHTML={{ __html: fullViewSvg }}
                />
              </div>
              <div className="mt-6 flex items-center justify-center space-x-4 shrink-0">
                <button
                  type="button"
                  onClick={() => handleDownloadSvg(fullViewSvg)}
                  className="px-5 py-2.5 bg-[#00F0FF] hover:bg-[#00F0FF]/80 text-black font-bold text-xs rounded-xl flex items-center space-x-2 transition-colors shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download SVG Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFullViewSvg(null)}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-semibold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
