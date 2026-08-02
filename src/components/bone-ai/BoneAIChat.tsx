import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Volume2, Square, X, ChevronDown, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatMessage } from '../../services/chatHistoryStore';
import { aiService } from '../../services/aiService';

interface BoneAIChatProps {
  messages: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
  onUpdateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  currentRoute: string;
}

const MODES = ['Smart', 'Think Deeper', 'Study & Learn', 'Google Search'];

export const BoneAIChat: React.FC<BoneAIChatProps> = ({ messages, onAddMessage, onUpdateMessage, currentRoute }) => {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState('Smart');
  const [isModeOpen, setIsModeOpen] = useState(false);
  const [image, setImage] = useState<{ file: File; base64: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Maximum image size is 10 MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Only JPG, PNG, and WebP formats are supported');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage({ file, base64: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText !== undefined ? customText : inputText.trim();
    if ((!textToSend && !image) || isGenerating) return;

    const userMsgId = Date.now().toString();
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
      image: image?.base64
    };
    onAddMessage(userMsg);
    
    const currentText = textToSend;
    const currentMode = mode;
    const currentImage = image ? { data: image.base64, mimeType: image.file.type } : undefined;
    
    setInputText('');
    setImage(null);
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
      const response = await aiService.sendMessage({
        message: currentText,
        mode: currentMode,
        image: currentImage,
        conversationId: botMsgId,
        assistantContext: { currentRoute }
      });

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
  const renderFormattedText = (text: string) => {
    if (text === '...') {
      return (
        <div className="flex space-x-1.5 items-center h-5">
          <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      );
    }

    // Escape basic HTML elements to prevent raw scripting/iframe loads
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Helper for chemical/math formulas inside $ ... $
    const parseMathToJSX = (mathText: string): React.ReactNode => {
      let clean = mathText.replace(/\\text\{([^}]+)\}/g, '$1');
      const tokens: React.ReactNode[] = [];
      let i = 0;
      while (i < clean.length) {
        if (clean[i] === '_') {
          i++;
          if (clean[i] === '{') {
            const end = clean.indexOf('}', i);
            if (end !== -1) {
              tokens.push(<sub key={i} className="text-xs font-sans font-bold select-text">{clean.substring(i + 1, end)}</sub>);
              i = end + 1;
            } else {
              tokens.push(<sub key={i} className="text-xs font-sans font-bold select-text">{clean.substring(i)}</sub>);
              break;
            }
          } else {
            tokens.push(<sub key={i} className="text-xs font-sans font-bold select-text">{clean[i]}</sub>);
            i++;
          }
        } else if (clean[i] === '^') {
          i++;
          if (clean[i] === '{') {
            const end = clean.indexOf('}', i);
            if (end !== -1) {
              tokens.push(<sup key={i} className="text-xs font-sans font-bold select-text">{clean.substring(i + 1, end)}</sup>);
              i = end + 1;
            } else {
              tokens.push(<sup key={i} className="text-xs font-sans font-bold select-text">{clean.substring(i)}</sup>);
              break;
            }
          } else {
            tokens.push(<sup key={i} className="text-xs font-sans font-bold select-text">{clean[i]}</sup>);
            i++;
          }
        } else {
          tokens.push(clean[i]);
          i++;
        }
      }
      return <>{tokens}</>;
    };

    // Helper for inline formatting (bold, math)
    const parseInlineFormatting = (lineText: string): React.ReactNode[] => {
      const mathSegments = lineText.split('$');
      return mathSegments.map((segText, sIdx) => {
        if (sIdx % 2 === 1) {
          return (
            <span key={sIdx} className="font-mono text-[#00F0FF] bg-white/5 px-1 py-0.5 rounded select-text">
              {parseMathToJSX(segText)}
            </span>
          );
        }
        
        const boldSegments = segText.split('**');
        return boldSegments.map((bSeg, bIdx) => {
          if (bIdx % 2 === 1) {
            return <strong key={`${sIdx}-${bIdx}`} className="text-white font-bold select-text">{bSeg}</strong>;
          }
          return bSeg;
        });
      });
    };

    // Handle code blocks (simple format)
    const segments = escaped.split('```');
    return segments.map((seg, idx) => {
      if (idx % 2 === 1) {
        // Code segment
        return (
          <pre key={idx} className="my-2 p-3 bg-black/40 border border-white/10 rounded-xl overflow-x-auto text-xs text-[#00F0FF] font-mono leading-relaxed select-text">
            <code>{seg.trim()}</code>
          </pre>
        );
      }
      
      const lines = seg.split('\n');
      return lines.map((line, lIdx) => {
        let cleanLine = line.trim();

        // 1. Headers detection
        if (cleanLine.startsWith('### ')) {
          return (
            <h3 key={lIdx} className="text-sm font-black text-white mt-4 mb-2 tracking-wide select-text">
              {parseInlineFormatting(cleanLine.substring(4))}
            </h3>
          );
        }
        if (cleanLine.startsWith('## ')) {
          return (
            <h2 key={lIdx} className="text-base font-black text-white mt-5 mb-2 pb-1 border-b border-white/5 tracking-wide select-text">
              {parseInlineFormatting(cleanLine.substring(3))}
            </h2>
          );
        }
        if (cleanLine.startsWith('# ')) {
          return (
            <h1 key={lIdx} className="text-lg font-black text-white mt-6 mb-3 tracking-tight select-text">
              {parseInlineFormatting(cleanLine.substring(2))}
            </h1>
          );
        }

        // 2. Blockquote / Flowchart step detection
        if (cleanLine.startsWith('&gt; ') || cleanLine.startsWith('> ')) {
          const content = cleanLine.startsWith('&gt; ') ? cleanLine.substring(5) : cleanLine.substring(2);
          return (
            <div key={lIdx} className="border-l-2 border-[#00F0FF]/50 pl-3 my-2 text-[#00F0FF] font-semibold italic text-xs leading-relaxed select-text bg-[#00F0FF]/5 py-1 rounded-r-lg">
              {parseInlineFormatting(content)}
            </div>
          );
        }

        // 3. Bullet list detection
        const isBullet = cleanLine.startsWith('- ') || cleanLine.startsWith('* ') || cleanLine.startsWith('• ');
        if (isBullet) {
          const content = cleanLine.substring(2);
          return (
            <div key={lIdx} className="flex items-start space-x-2 my-1 pl-2">
              <span className="text-[#00F0FF] mt-1.5">•</span>
              <span className="text-sm text-gray-300 flex-1 select-text">
                {parseInlineFormatting(content)}
              </span>
            </div>
          );
        }

        // 4. Default paragraph
        return (
          <p key={lIdx} className="text-sm text-gray-300 min-h-[1.25rem] leading-relaxed select-text">
            {parseInlineFormatting(cleanLine)}
          </p>
        );
      });
    });
  };


  return (
    <div className="flex flex-col h-full bg-[#040812]/95 backdrop-blur-md rounded-b-3xl">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-premium">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8 space-y-4">
            <h3 className="text-lg font-bold text-white tracking-wide">Hey, what’s on your mind today?</h3>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              Ask about the platform, find learning content, or upload an image for help.
            </p>
            <div className="grid grid-cols-1 gap-2 w-full max-w-sm mt-4">
              {['Help me find notes', 'Where are my saved videos?', 'Explain this topic', 'How do I upload content?'].map(prompt => (
                <button 
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="w-full px-4 py-2.5 bg-[#0D213A]/50 hover:bg-[#0D213A] border border-white/5 rounded-2xl text-xs text-left text-[#00F0FF] transition-all hover:border-[var(--color-cyan)]/30"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-[#00F0FF]/15 to-[#FF00FF]/15 border border-white/10 text-white rounded-br-sm' 
                  : 'bg-[#0D213A] border border-white/5 text-gray-200 rounded-bl-sm'
              }`}>
                {msg.image && (
                  <div className="mb-2.5 rounded-xl overflow-hidden border border-white/10">
                    <img src={msg.image} alt="Doubt Upload" className="max-h-48 w-auto object-contain" />
                  </div>
                )}
                
                <div className="space-y-1">
                  {renderFormattedText(msg.content)}
                </div>
                
                {/* Google Search Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-white/10">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-gray-500 mb-1.5 block">Sources found</span>
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

                {/* Speech Tool */}
                {msg.role === 'assistant' && msg.content !== '...' && (
                  <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-1.5">
                    {msg.mode && <span className="text-[9px] text-[#00F0FF]/60 uppercase tracking-widest font-semibold">{msg.mode}</span>}
                    <button 
                      onClick={() => toggleSpeech(msg.content, msg.id)}
                      className="p-1 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                      title={speakingId === msg.id ? "Stop voice" : "Listen response"}
                      aria-label="Read aloud"
                    >
                      {speakingId === msg.id ? <Square className="w-3 h-3 fill-current text-[var(--color-cyan)]" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <div className="p-4 border-t border-white/10 bg-[#070e1b] rounded-b-3xl relative">
        {/* Local Image Preview */}
        <AnimatePresence>
          {image && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute -top-20 left-4 p-1.5 bg-[#0D213A] border border-white/10 rounded-xl shadow-2xl flex items-start space-x-2"
            >
              <img src={image.base64} alt="Upload Thumbnail" className="h-14 w-14 object-cover rounded-lg" />
              <button 
                onClick={() => setImage(null)} 
                className="p-1 bg-red-500 rounded-full hover:bg-red-600 text-white transition-colors"
                title="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end bg-[#0D213A] border border-white/10 rounded-2xl p-2 focus-within:border-[#00F0FF]/50 transition-colors">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/jpeg, image/png, image/webp"
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-[#00F0FF] transition-colors rounded-xl"
            title="Upload image (Max 10MB)"
            aria-label="Attach file"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          
          <div className="flex-1 ml-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask Bone AI anything..."
              className="w-full bg-transparent border-none text-white text-sm focus:ring-0 resize-none py-2 max-h-32 min-h-[38px] outline-none"
              rows={1}
            />
          </div>

          <div className="flex items-center space-x-2 ml-2">
            {/* Mode Picker dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsModeOpen(!isModeOpen)}
                className="flex items-center space-x-1 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-300 transition-colors"
                title="Select Mode"
              >
                <span>{mode}</span>
                <ChevronDown className="w-3 h-3 text-[#00F0FF]" />
              </button>
              
              <AnimatePresence>
                {isModeOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsModeOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute bottom-full right-0 mb-2 w-44 bg-[#0D213A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20"
                    >
                      {MODES.map(m => (
                        <button
                          key={m}
                          onClick={() => { setMode(m); setIsModeOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${mode === m ? 'bg-[#00F0FF]/15 text-[#00F0FF] font-bold' : 'text-gray-300 hover:bg-white/5'}`}
                        >
                          {m}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => handleSend()}
              disabled={isGenerating || (!inputText.trim() && !image)}
              className="p-2.5 bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-[#040812] rounded-xl hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all"
              aria-label="Send query"
              title="Send Message"
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
