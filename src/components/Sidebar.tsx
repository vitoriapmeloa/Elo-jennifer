import React from 'react';
import { 
  Settings, 
  Search, 
  SquarePen, 
  MessageSquare, 
  Pin, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import { Conversation, ProfileData } from '../types';

interface SidebarProps {
  profile: ProfileData;
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onOpenSettings: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  profile,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onOpenSettings,
  isOpenMobile,
  onCloseMobile,
  searchQuery,
  onSearchChange,
}) => {
  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 sm:w-80 bg-[#fbfbfd]/90 dark:bg-[#161617]/90 backdrop-blur-2xl border-r border-black/[0.06] dark:border-white/[0.08] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* TOP SECTION: Window Dots, Profile Photo, and Name "Elô - Jennifer" */}
        <div className="flex flex-col p-4 pb-2">
          {/* macOS Window Controls + Mobile Close */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e] inline-block shadow-2xs" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24] inline-block shadow-2xs" />
              <span className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29] inline-block shadow-2xs" />
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onNewConversation}
                className="p-1.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
                title="Nova Conversa"
                aria-label="Nova Conversa"
              >
                <SquarePen className="w-4 h-4" />
              </button>

              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
                aria-label="Fechar menu lateral"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* REQUIRED BY USER:
              - No topo, exibir a foto de perfil
              - Logo abaixo, o nome: “Elô - Jennifer”
          */}
          <div className="flex flex-col items-center text-center pt-1 pb-4">
            {/* Foto de Perfil */}
            <div className="relative group cursor-pointer" onClick={onOpenSettings} title="Ajustar perfil nas Configurações">
              <div className="w-20 h-20 rounded-full overflow-hidden p-0.5 bg-gradient-to-b from-white via-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-900 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.12)] ring-1 ring-black/5 dark:ring-white/10 transition-transform duration-200 group-hover:scale-[1.02]">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Online Green Indicator Dot */}
              <span 
                className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-[#34c759] border-2 border-white dark:border-[#161617] shadow-xs" 
                title="Status: Online no Ecossistema Apple"
              />
            </div>

            {/* Logo abaixo, o nome: “Elô - Jennifer” */}
            <h1 className="mt-2.5 text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              {profile.name}
            </h1>
            
            {/* Minimalist Subtitle / Apple status */}
            <p className="text-[12px] text-black/50 dark:text-white/50 tracking-normal mt-0.5 flex items-center gap-1">
              <span>{profile.statusMessage}</span>
            </p>
          </div>

          {/* Minimal Search Field */}
          <div className="relative mt-1 mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/40 dark:text-white/40" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.09] focus:bg-white dark:focus:bg-[#202022] border border-transparent focus:border-black/10 dark:focus:border-white/15 rounded-xl transition-all placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* MIDDLE SECTION: Conversations List (Clean Apple Messages style) */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          <div className="px-2 py-1 flex items-center justify-between">
            <span className="text-[11px] font-medium text-black/40 dark:text-white/40 uppercase tracking-wider">
              Conversas Recentes
            </span>
            <span className="text-[10px] text-black/40 dark:text-white/40 font-mono">
              {filteredConversations.length}
            </span>
          </div>

          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 px-3 text-xs text-black/40 dark:text-white/40">
              Nenhuma conversa encontrada
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    onCloseMobile();
                  }}
                  className={`w-full group text-left px-3 py-2.5 rounded-xl transition-all relative flex items-start gap-2.5 ${
                    isActive
                      ? 'bg-black/[0.07] dark:bg-white/[0.12] text-[#1d1d1f] dark:text-white shadow-2xs font-medium'
                      : 'text-black/70 dark:text-white/70 hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="relative mt-0.5 shrink-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-black/5 dark:ring-white/10 bg-neutral-200 dark:bg-neutral-800">
                      <img 
                        src={profile.avatarUrl} 
                        alt="" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {conv.isPinned && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#007aff] text-white flex items-center justify-center">
                        <Pin className="w-2 h-2" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold truncate leading-tight">
                        {conv.title}
                      </span>
                      <span className="text-[10px] text-black/40 dark:text-white/40 shrink-0 font-normal">
                        {conv.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-black/50 dark:text-white/50 truncate mt-0.5 leading-snug">
                      {conv.subtitle}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* BOTTOM SECTION: REQUIRED BY USER:
            "Na parte inferior da sidebar, exibir um botão de Configurações"
        */}
        <div className="p-3 border-t border-black/[0.06] dark:border-white/[0.08] bg-[#fbfbfd]/95 dark:bg-[#161617]/95">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#202022] hover:bg-neutral-50 dark:hover:bg-[#28282b] border border-black/[0.06] dark:border-white/[0.08] text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] shadow-2xs hover:shadow-xs transition-all group"
            aria-label="Abrir configurações"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-black/[0.05] dark:bg-white/[0.08] flex items-center justify-center text-black/70 dark:text-white/70 group-hover:rotate-45 transition-transform duration-300">
                <Settings className="w-3.5 h-3.5" />
              </div>
              <span>Configurações</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-black/40 dark:text-white/40">
              <span className="text-[10px] font-mono tracking-tight hidden sm:inline">⌘,</span>
              <ChevronRight className="w-3.5 h-3.5 text-black/30 dark:text-white/30 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};
