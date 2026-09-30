export type ThemeMode = 'light' | 'dark' | 'system';

export type TapbackReaction = 'heart' | 'like' | 'dislike' | 'laugh' | 'exclamation' | 'question';

export interface MessageAttachment {
  type: 'image' | 'audio' | 'document';
  url?: string;
  name?: string;
  duration?: string;
  size?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'elo';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  reaction?: TapbackReaction;
  attachment?: MessageAttachment;
}

export interface Conversation {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  unreadCount?: number;
  isPinned?: boolean;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsedAt?: string;
}

export interface ProfileData {
  name: string;
  avatarUrl: string;
  statusMessage: string;
  role: string;
}
