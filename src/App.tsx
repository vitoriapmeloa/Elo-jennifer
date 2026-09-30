/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { SettingsModal } from './components/SettingsModal';
import { FaceTimeModal } from './components/FaceTimeModal';
import { ThemeMode, ProfileData, ApiKeyItem, Conversation, Message, TapbackReaction } from './types';

const INITIAL_PROFILE: ProfileData = {
  name: 'Elô - Jennifer',
  avatarUrl: '/src/assets/images/elo_jennifer_avatar_1790772286063.jpg',
  statusMessage: 'Disponível no Ecossistema Apple',
  role: 'Inteligência e Produtividade Pessoal',
};

const INITIAL_API_KEYS: ApiKeyItem[] = [
  {
    id: 'key_1',
    name: 'Assistente Elô - Web',
    key: 'elo_live_7e8b91c049f284e91024bc0192451',
    createdAt: 'Hoje às 09:15',
    lastUsedAt: 'Hoje às 10:40',
  },
  {
    id: 'key_2',
    name: 'Atalhos da Siri e Automação',
    key: 'elo_live_38d94a10ec29f4bb8194ad98214b',
    createdAt: 'Ontem às 16:30',
    lastUsedAt: 'Ontem às 19:12',
  },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    title: 'Elô - Jennifer',
    subtitle: 'Pronta para auxiliar em tarefas, foco e design.',
    timestamp: '10:42',
    isPinned: true,
  },
  {
    id: 'conv_2',
    title: 'Design System do macOS',
    subtitle: 'Cantos arredondados, glassmorphism e tipografia.',
    timestamp: 'Ontem',
    isPinned: false,
  },
  {
    id: 'conv_3',
    title: 'Planejamento e Foco',
    subtitle: 'Organização dos principais tópicos da semana.',
    timestamp: 'Segunda',
    isPinned: false,
  },
  {
    id: 'conv_4',
    title: 'Ideias de Produto & Tecnologia',
    subtitle: 'Arquitetura limpa e experiência refinada.',
    timestamp: '27/09',
    isPinned: false,
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    sender: 'elo',
    text: 'Olá! Sou a Elô. Seu espaço de conversação está pronto, com toda a elegância, fluidez e simplicidade inspiradas no ecossistema Apple.',
    timestamp: '10:40',
  },
  {
    id: 'msg_2',
    sender: 'elo',
    text: 'Você pode explorar a interface, enviar mensagens, gravar notas de voz, ou abrir as Configurações na barra lateral para personalizar minha foto de perfil, o tema (claro/escuro) e gerar chaves de API.',
    timestamp: '10:41',
  },
  {
    id: 'msg_3',
    sender: 'user',
    text: 'Adorei a estética limpa e o efeito de transparência!',
    timestamp: '10:42',
    status: 'read',
    reaction: 'heart',
  },
  {
    id: 'msg_4',
    sender: 'elo',
    text: 'Cada detalhe foi desenhado com base no macOS e iOS: curvas contínuas, tipografia com alto contraste e foco total no que importa. O que você gostaria de criar ou consultar agora?',
    timestamp: '10:42',
  },
];

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('apple_chat_theme') as ThemeMode;
    return saved || 'light';
  });

  // Profile state
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = localStorage.getItem('apple_chat_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PROFILE;
      }
    }
    return INITIAL_PROFILE;
  });

  // API keys state
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(() => {
    const saved = localStorage.getItem('apple_chat_apikeys');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_API_KEYS;
      }
    }
    return INITIAL_API_KEYS;
  });

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>('conv_1');
  const [searchQuery, setSearchQuery] = useState('');

  // Messages state
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);
  const [callModal, setCallModal] = useState<{ isOpen: boolean; type: 'audio' | 'video' }>({
    isOpen: false,
    type: 'audio',
  });

  // Apply Theme to DOM
  useEffect(() => {
    localStorage.setItem('apple_chat_theme', theme);
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Persist Profile
  useEffect(() => {
    localStorage.setItem('apple_chat_profile', JSON.stringify(profile));
  }, [profile]);

  // Persist API Keys
  useEffect(() => {
    localStorage.setItem('apple_chat_apikeys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  // Keyboard shortcut ⌘, to open settings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setCallModal((c) => ({ ...c, isOpen: false }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleProfileChange = (updated: Partial<ProfileData>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleAddApiKey = (name: string) => {
    // Generate secure simulated Apple token
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    const newKey: ApiKeyItem = {
      id: `key_${Date.now()}`,
      name,
      key: `elo_live_${randomHex}`,
      createdAt: 'Agora mesmo',
      lastUsedAt: 'Recém criada',
    };
    setApiKeys((prev) => [newKey, ...prev]);
  };

  const handleDeleteApiKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const handleNewConversation = () => {
    const newId = `conv_${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: 'Nova Conversa Apple',
      subtitle: 'Iniciada agora...',
      timestamp: 'Agora',
      isPinned: false,
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    setMessages([
      {
        id: `msg_${Date.now()}`,
        sender: 'elo',
        text: `Olá! Iniciamos uma nova sessão com ${profile.name}. Como posso ajudar você neste momento?`,
        timestamp: new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date()),
      },
    ]);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg_${Date.now()}`,
        sender: 'elo',
        text: 'Histórico da conversa reiniciado com segurança no dispositivo.',
        timestamp: new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date()),
      },
    ]);
  };

  const handleToggleReaction = (messageId: string, reaction: TapbackReaction) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            reaction: msg.reaction === reaction ? undefined : reaction,
          };
        }
        return msg;
      })
    );
  };

  const handleSendMessage = (text: string, attachment?: Message['attachment']) => {
    const timeString = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    const userMessage: Message = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: timeString,
      status: 'sent',
      attachment,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Update conversation subtitle
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? { ...c, subtitle: text, timestamp: timeString }
          : c
      )
    );

    // Simulate smart, articulate Apple-style response
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      let replyText = '';
      const lower = text.toLowerCase();

      if (lower.includes('olá') || lower.includes('oi') || lower.includes('ola')) {
        replyText = `Olá! Que bom falar com você. Estou pronta para acelerar suas ideias com máxima simplicidade e foco.`;
      } else if (lower.includes('design') || lower.includes('apple') || lower.includes('estética') || lower.includes('mac')) {
        replyText = `O segredo do design no ecossistema Apple está na redução ao essencial: cantos arredondados com curvatura orgânica (squircles), sombras com desfoque difuso, superfícies translúcidas com efeito vidro e tipografia com hierarquia nítida. Menos ornamentação, mais clareza.`;
      } else if (lower.includes('agenda') || lower.includes('reunião') || lower.includes('semana') || lower.includes('organizar')) {
        replyText = `Com certeza. Para organizar sua semana com eficiência no padrão Apple:\n\n1. Blocos de Foco matinais (90 minutos sem notificações)\n2. Reuniões condensadas em 25 minutos\n3. Revisão diária ao final da tarde sincronizada com seus lembretes.`;
      } else if (lower.includes('api') || lower.includes('chave') || lower.includes('token')) {
        replyText = `Você pode gerenciar e gerar chaves de API clicando em "Configurações" na barra lateral esquerda. As chaves são criptografadas e preparadas para conexões seguras.`;
      } else if (lower.includes('foto') || lower.includes('perfil') || lower.includes('imagem')) {
        replyText = `Para alterar a minha foto de perfil, abra "Configurações" no rodapé da barra lateral e escolha entre a coleção de retratos Apple ou faça o upload de uma imagem do seu computador.`;
      } else if (lower.includes('áudio') || lower.includes('audio') || lower.includes('nota')) {
        replyText = `Recebi sua nota de voz com áudio espacial cristalino. Ficou excelente e perfeitamente audível.`;
      } else {
        replyText = `Entendido. Anotei seu pedido com precisão. O ecossistema está sincronizado e podemos aprofundar qualquer detalhe que precisar.`;
      }

      const eloReply: Message = {
        id: `msg_elo_${Date.now()}`,
        sender: 'elo',
        text: replyText,
        timestamp: new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date()),
      };

      setMessages((prev) => [...prev, eloReply]);
    }, 1200);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#ffffff] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] select-none font-sans">
      {/* 
        Single Left Sidebar (Strictly meets user requirement):
        - No topo: foto de perfil
        - Logo abaixo: o nome "Elô - Jennifer"
        - Na parte inferior da sidebar: botão de Configurações
      */}
      <Sidebar
        profile={profile}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewConversation={handleNewConversation}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpenMobile={isOpenMobileSidebar}
        onCloseMobile={() => setIsOpenMobileSidebar(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Conversation Canvas Area */}
      <ChatArea
        profile={profile}
        messages={messages}
        onSendMessage={handleSendMessage}
        onClearChat={handleClearChat}
        onToggleReaction={handleToggleReaction}
        isTyping={isTyping}
        onOpenMobileSidebar={() => setIsOpenMobileSidebar(true)}
        onStartCall={(type) => setCallModal({ isOpen: true, type })}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Settings Modal (Configurações: Alterar foto de perfil, alternar modo claro/escuro, gerar chave de API) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
        profile={profile}
        onProfileChange={handleProfileChange}
        apiKeys={apiKeys}
        onAddApiKey={handleAddApiKey}
        onDeleteApiKey={handleDeleteApiKey}
      />

      {/* FaceTime / Audio Call Simulation */}
      <FaceTimeModal
        isOpen={callModal.isOpen}
        onClose={() => setCallModal((prev) => ({ ...prev, isOpen: false }))}
        profile={profile}
        callType={callModal.type}
      />
    </div>
  );
}
