import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  MicOff, 
  Phone, 
  Video, 
  MoreHorizontal, 
  Search, 
  Check, 
  CheckCheck, 
  Play, 
  Pause, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles, 
  Image as ImageIcon, 
  Trash2, 
  Menu,
  X,
  Share2,
  Info
} from 'lucide-react';
import { Message, ProfileData, TapbackReaction } from '../types';

interface ChatAreaProps {
  profile: ProfileData;
  messages: Message[];
  onSendMessage: (text: string, attachment?: Message['attachment']) => void;
  onClearChat: () => void;
  onToggleReaction: (messageId: string, reaction: TapbackReaction) => void;
  isTyping: boolean;
  onOpenMobileSidebar: () => void;
  onStartCall: (type: 'audio' | 'video') => void;
  onOpenSettings: () => void;
}

const QUICK_PROMPTS = [
  'Quais são os princípios de design do macOS Sequoia?',
  'Ajude a organizar minha agenda semanal com foco',
  'Escreva um email profissional e elegante',
  'Explique como funciona o ecossistema Apple com inteligência'
];

export const ChatArea: React.FC<ChatAreaProps> = ({
  profile,
  messages,
  onSendMessage,
  onClearChat,
  onToggleReaction,
  isTyping,
  onOpenMobileSidebar,
  onStartCall,
  onOpenSettings,
}) => {
  const [inputText, setInputText] = useState('');
  const [activeTapbackMessageId, setActiveTapbackMessageId] = useState<string | null>(null);
  const [isPlayingAudioId, setIsPlayingAudioId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Voice recording timer simulation
  useEffect(() => {
    let interval: any;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  // Audio player simulation
  useEffect(() => {
    let anim: any;
    if (isPlayingAudioId) {
      anim = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudioId(null);
            return 0;
          }
          return prev + 5;
        });
      }, 200);
    } else {
      setAudioProgress(0);
    }
    return () => clearInterval(anim);
  }, [isPlayingAudioId]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSendAudioNote = () => {
    setIsRecordingVoice(false);
    onSendMessage('Mensagem de Áudio', {
      type: 'audio',
      duration: `${recordingSeconds || 8}s`,
      name: 'Nota de Voz Gravada'
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSendMessage('Foto enviada', {
            type: 'image',
            url: event.target.result as string,
            name: file.name
          });
        }
      };
      reader.readAsDataURL(file);
      setShowAttachMenu(false);
    }
  };

  const filteredMessages = chatSearchQuery.trim()
    ? messages.filter((m) => m.text.toLowerCase().includes(chatSearchQuery.toLowerCase()))
    : messages;

  return (
    <main className="flex-1 flex flex-col h-full bg-[#ffffff] dark:bg-[#1a1a1c] relative min-w-0 transition-colors">
      {/* Apple macOS / iOS Inspired Conversation Header */}
      <header className="h-16 px-4 md:px-6 border-b border-black/[0.06] dark:border-white/[0.08] bg-[#ffffff]/80 dark:bg-[#1a1a1c]/80 backdrop-blur-xl flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile hamburger menu */}
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-1.5 -ml-1 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Contact Avatar & Info */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onOpenSettings}
            title="Ajustes de Perfil"
          >
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-black/10 dark:ring-white/10 bg-neutral-200">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#34c759] border-2 border-white dark:border-[#1a1a1c]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs md:text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] truncate group-hover:text-[#007aff] transition-colors">
                  {profile.name}
                </h2>
                <span className="text-[10px] text-black/40 dark:text-white/40 hidden sm:inline">
                  ›
                </span>
              </div>
              <p className="text-[11px] text-black/50 dark:text-white/50 truncate flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#34c759]" />
                <span>iMessage • Mensagens sincronizadas</span>
              </p>
            </div>
          </div>
        </div>

        {/* Header Right Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => onStartCall('audio')}
            className="p-2 rounded-xl text-black/70 dark:text-white/70 hover:text-[#007aff] dark:hover:text-[#007aff] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            title="FaceTime de Áudio"
            aria-label="Iniciar chamada de áudio"
          >
            <Phone className="w-4 h-4" />
          </button>

          <button
            onClick={() => onStartCall('video')}
            className="p-2 rounded-xl text-black/70 dark:text-white/70 hover:text-[#007aff] dark:hover:text-[#007aff] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            title="FaceTime de Vídeo"
            aria-label="Iniciar chamada de vídeo"
          >
            <Video className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-xl transition-colors ${
              showSearch
                ? 'bg-[#007aff]/10 text-[#007aff]'
                : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
            }`}
            title="Buscar nesta conversa"
            aria-label="Buscar mensagens"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={onClearChat}
            className="p-2 rounded-xl text-black/50 dark:text-white/50 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Limpar Conversa"
            aria-label="Limpar conversa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* In-Chat Search Bar Toggle */}
      {showSearch && (
        <div className="px-4 py-2 border-b border-black/[0.04] dark:border-white/[0.06] bg-[#f8f8fa] dark:bg-[#1f1f21] flex items-center gap-2 animate-in slide-in-from-top-2">
          <Search className="w-3.5 h-3.5 text-black/40 dark:text-white/40 shrink-0" />
          <input
            type="text"
            placeholder="Buscar no histórico desta conversa..."
            value={chatSearchQuery}
            onChange={(e) => setChatSearchQuery(e.target.value)}
            className="flex-1 text-xs bg-transparent border-none outline-hidden placeholder:text-black/40 dark:placeholder:text-white/40"
            autoFocus
          />
          {chatSearchQuery && (
            <button
              onClick={() => setChatSearchQuery('')}
              className="text-xs text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
            >
              Limpar
            </button>
          )}
          <button
            onClick={() => {
              setShowSearch(false);
              setChatSearchQuery('');
            }}
            className="p-1 rounded text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
        {/* Subtle Apple Encrypted Banner */}
        <div className="flex flex-col items-center justify-center my-2 text-center">
          <span className="text-[11px] text-black/40 dark:text-white/40 font-medium tracking-tight">
            Hoje
          </span>
          <span className="text-[10px] text-black/35 dark:text-white/35 max-w-sm mt-0.5">
            As mensagens enviadas são protegidas com criptografia de ponta a ponta Apple.
          </span>
        </div>

        {/* Message Items */}
        {filteredMessages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          const isLastUserMsg = isUser && index === filteredMessages.length - 1;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group relative`}
            >
              {/* Tapback Reaction Floating Bar (Opens on click/hover) */}
              {activeTapbackMessageId === msg.id && (
                <div 
                  className={`absolute -top-11 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#2c2c2e]/95 backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.15)] border border-black/10 dark:border-white/10 animate-in zoom-in-90 duration-150 ${
                    isUser ? 'right-0' : 'left-0'
                  }`}
                >
                  <button
                    onClick={() => {
                      onToggleReaction(msg.id, 'heart');
                      setActiveTapbackMessageId(null);
                    }}
                    className="p-1 hover:scale-125 transition-transform text-rose-500"
                    title="Amei"
                  >
                    ❤️
                  </button>
                  <button
                    onClick={() => {
                      onToggleReaction(msg.id, 'like');
                      setActiveTapbackMessageId(null);
                    }}
                    className="p-1 hover:scale-125 transition-transform"
                    title="Gostei"
                  >
                    👍
                  </button>
                  <button
                    onClick={() => {
                      onToggleReaction(msg.id, 'dislike');
                      setActiveTapbackMessageId(null);
                    }}
                    className="p-1 hover:scale-125 transition-transform"
                    title="Não gostei"
                  >
                    👎
                  </button>
                  <button
                    onClick={() => {
                      onToggleReaction(msg.id, 'laugh');
                      setActiveTapbackMessageId(null);
                    }}
                    className="p-1 hover:scale-125 transition-transform"
                    title="Risada"
                  >
                    😆
                  </button>
                  <button
                    onClick={() => {
                      onToggleReaction(msg.id, 'exclamation');
                      setActiveTapbackMessageId(null);
                    }}
                    className="p-1 hover:scale-125 transition-transform"
                    title="Exclamação"
                  >
                    ‼️
                  </button>
                  <button
                    onClick={() => {
                      onToggleReaction(msg.id, 'question');
                      setActiveTapbackMessageId(null);
                    }}
                    className="p-1 hover:scale-125 transition-transform"
                    title="Dúvida"
                  >
                    ❓
                  </button>
                </div>
              )}

              {/* Speech Bubble Container */}
              <div className="relative max-w-[85%] sm:max-w-[70%]">
                <div
                  onClick={() => setActiveTapbackMessageId(activeTapbackMessageId === msg.id ? null : msg.id)}
                  className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed cursor-pointer transition-all relative ${
                    isUser
                      ? 'bg-gradient-to-b from-[#007aff] to-[#006ee6] text-white shadow-xs rounded-br-xs selection:bg-white/30 selection:text-white'
                      : 'bg-[#e9e9eb] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] rounded-bl-xs selection:bg-[#007aff]/20'
                  }`}
                >
                  {/* Image Attachment */}
                  {msg.attachment?.type === 'image' && (
                    <div className="mb-2 rounded-xl overflow-hidden shadow-xs ring-1 ring-black/10">
                      <img 
                        src={msg.attachment.url} 
                        alt={msg.attachment.name || 'Imagem'} 
                        className="w-full max-h-60 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Audio Message Attachment */}
                  {msg.attachment?.type === 'audio' && (
                    <div className="flex items-center gap-3 py-1 min-w-[200px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPlayingAudioId(isPlayingAudioId === msg.id ? null : msg.id);
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isUser ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10 text-current'
                        }`}
                      >
                        {isPlayingAudioId === msg.id ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>

                      {/* Animated Sound Wave Graphic */}
                      <div className="flex-1 flex items-center gap-0.5 h-6">
                        {[4, 10, 16, 8, 20, 14, 18, 9, 22, 12, 16, 7, 14, 10, 6].map((h, i) => {
                          const isWaveActive = isPlayingAudioId === msg.id && (i / 15) * 100 <= audioProgress;
                          return (
                            <span
                              key={i}
                              style={{ height: `${h}px` }}
                              className={`w-1 rounded-full transition-all duration-150 ${
                                isWaveActive
                                  ? isUser ? 'bg-white' : 'bg-[#007aff]'
                                  : isUser ? 'bg-white/40' : 'bg-black/20 dark:bg-white/20'
                              }`}
                            />
                          );
                        })}
                      </div>

                      <span className={`text-[10px] font-mono shrink-0 ${isUser ? 'text-white/80' : 'text-black/50 dark:text-white/50'}`}>
                        {msg.attachment.duration || '0:08'}
                      </span>
                    </div>
                  )}

                  {/* Message Text */}
                  {msg.text && (
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  )}

                  {/* Tapback Badge on top of bubble */}
                  {msg.reaction && (
                    <div 
                      className={`absolute -top-2.5 ${
                        isUser ? '-left-2' : '-right-2'
                      } bg-white dark:bg-[#1e1e1e] shadow-md border border-black/10 dark:border-white/10 rounded-full px-1.5 py-0.5 text-xs flex items-center gap-0.5 transform scale-110`}
                    >
                      {msg.reaction === 'heart' && '❤️'}
                      {msg.reaction === 'like' && '👍'}
                      {msg.reaction === 'dislike' && '👎'}
                      {msg.reaction === 'laugh' && '😆'}
                      {msg.reaction === 'exclamation' && '‼️'}
                      {msg.reaction === 'question' && '❓'}
                    </div>
                  )}
                </div>

                {/* Quick Tapback Action Hint button on hover */}
                <button
                  onClick={() => setActiveTapbackMessageId(activeTapbackMessageId === msg.id ? null : msg.id)}
                  className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white transition-opacity ${
                    isUser ? '-left-7' : '-right-7'
                  }`}
                  title="Reagir com Tapback"
                >
                  <Smile className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Delivery Receipt & Timestamp */}
              <div className={`flex items-center gap-1.5 mt-1 px-1 text-[11px] text-black/40 dark:text-white/40 ${isUser ? 'justify-end' : 'justify-start'}`}>
                <span>{msg.timestamp}</span>
                {isLastUserMsg && (
                  <>
                    <span>·</span>
                    <span className="font-medium">Entregue</span>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing Indicator with Apple Bouncing Dots */}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-black/10 dark:ring-white/10 bg-neutral-200 shrink-0">
              <img
                src={profile.avatarUrl}
                alt=""
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="bg-[#e9e9eb] dark:bg-[#2c2c2e] px-4 py-3 rounded-2xl rounded-bl-xs flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-black/40 dark:bg-white/40 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-black/40 dark:bg-white/40 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-black/40 dark:bg-white/40 animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts Bar */}
      {messages.length <= 4 && (
        <div className="px-4 md:px-8 py-2 overflow-x-auto no-scrollbar flex items-center gap-2 border-t border-black/[0.04] dark:border-white/[0.04] bg-white/50 dark:bg-[#1a1a1c]/50">
          <span className="text-[11px] font-medium text-black/40 dark:text-white/40 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#007aff]" />
            Sugestões:
          </span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(prompt)}
              className="px-3 py-1 rounded-full text-xs font-normal bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-black/70 dark:text-white/70 whitespace-nowrap transition-colors border border-black/[0.03] dark:border-white/[0.05]"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Apple Messages Pill Input Area */}
      <footer className="p-3 md:p-4 bg-[#ffffff]/90 dark:bg-[#1a1a1c]/90 backdrop-blur-xl border-t border-black/[0.06] dark:border-white/[0.08] shrink-0">
        <div className="max-w-4xl mx-auto relative">
          {/* Attachment Context Menu */}
          {showAttachMenu && (
            <div className="absolute bottom-14 left-0 z-30 p-2 bg-white/95 dark:bg-[#252528]/95 backdrop-blur-2xl rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.15)] border border-black/10 dark:border-white/10 w-56 animate-in slide-in-from-bottom-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-black/80 dark:text-white/80 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-[#007aff]" />
                <span>Enviar Foto ou Mídia</span>
              </button>
              <button
                onClick={() => {
                  setShowAttachMenu(false);
                  setIsRecordingVoice(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-black/80 dark:text-white/80 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
              >
                <Mic className="w-4 h-4 text-emerald-500" />
                <span>Gravar Mensagem de Áudio</span>
              </button>
              <button
                onClick={() => {
                  setShowAttachMenu(false);
                  onOpenSettings();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-black/80 dark:text-white/80 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Configurar Chave de API</span>
              </button>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Voice recording active bar */}
          {isRecordingVoice ? (
            <div className="flex items-center justify-between px-4 py-2.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                <span className="text-xs font-medium">Gravando nota de voz Apple: {recordingSeconds}s</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRecordingVoice(false)}
                  className="px-3 py-1 text-xs text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSendAudioNote}
                  className="px-4 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-full shadow-xs"
                >
                  Enviar Áudio
                </button>
              </div>
            </div>
          ) : (
            /* Standard Apple Capsule Input */
            <div className="flex items-end gap-2 bg-[#f2f2f4] dark:bg-[#2c2c2e] rounded-[24px] px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#007aff]/30 transition-all border border-black/[0.04] dark:border-white/[0.05]">
              {/* Plus Button */}
              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className={`p-1.5 rounded-full text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-transform ${
                  showAttachMenu ? 'rotate-45' : ''
                }`}
                title="Opções de anexo"
                aria-label="Opções de anexo"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Text Area Input */}
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="iMessage para Elô - Jennifer"
                rows={1}
                className="flex-1 bg-transparent border-0 outline-hidden py-1.5 text-xs sm:text-sm text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-black/40 dark:placeholder:text-white/40 resize-none max-h-32 min-h-[24px]"
              />

              {/* Voice memo icon button */}
              {!inputText.trim() && (
                <button
                  type="button"
                  onClick={() => setIsRecordingVoice(true)}
                  className="p-1.5 rounded-full text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  title="Gravar Áudio"
                  aria-label="Gravar áudio"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputText.trim()}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  inputText.trim()
                    ? 'bg-[#007aff] hover:bg-[#006ee6] text-white shadow-xs cursor-pointer active:scale-95'
                    : 'bg-black/10 dark:bg-white/10 text-black/30 dark:text-white/30 cursor-not-allowed'
                }`}
                aria-label="Enviar mensagem"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </footer>
    </main>
  );
};
