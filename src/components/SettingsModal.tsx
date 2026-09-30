import React, { useState, useRef } from 'react';
import { 
  X, 
  User, 
  Sun, 
  Moon, 
  Laptop, 
  Key, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  Upload, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  RefreshCw,
  Camera,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ApiKeyItem, ThemeMode, ProfileData } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
  profile: ProfileData;
  onProfileChange: (updated: Partial<ProfileData>) => void;
  apiKeys: ApiKeyItem[];
  onAddApiKey: (name: string) => void;
  onDeleteApiKey: (id: string) => void;
}

const PRESET_AVATARS = [
  {
    id: 'studio-portrait',
    name: 'Retrato Estúdio (Padrão)',
    url: '/src/assets/images/elo_jennifer_avatar_1790772286063.jpg',
    description: 'Estética clássica e refinada Apple'
  },
  {
    id: 'minimalist-memoji',
    name: 'Memoji 3D Minimalista',
    url: '/src/assets/images/avatar_minimalist_alt_1790772300109.jpg',
    description: 'Estilo digital contemporâneo'
  },
  {
    id: 'creative-portrait',
    name: 'Retrato Executivo Criativo',
    url: '/src/assets/images/avatar_creative_alt_1790772314247.jpg',
    description: 'Visual moderno com luz natural'
  }
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  profile,
  onProfileChange,
  apiKeys,
  onAddApiKey,
  onDeleteApiKey,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'apikeys'>('profile');
  const [newKeyName, setNewKeyName] = useState('');
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [nameInput, setNameInput] = useState(profile.name);
  const [statusInput, setStatusInput] = useState(profile.statusMessage);
  const [isSavedToast, setIsSavedToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCopyKey = (id: string, keyVal: string) => {
    navigator.clipboard.writeText(keyVal);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const toggleRevealKey = (id: string) => {
    setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newKeyName.trim() || 'Chave API Padrão';
    onAddApiKey(name);
    setNewKeyName('');
    setIsGeneratingKey(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onProfileChange({ avatarUrl: event.target.result as string });
          showSaveFeedback();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustomUrl = () => {
    if (customUrlInput.trim()) {
      onProfileChange({ avatarUrl: customUrlInput.trim() });
      setCustomUrlInput('');
      showSaveFeedback();
    }
  };

  const handleSaveProfileInfo = () => {
    onProfileChange({
      name: nameInput.trim() || 'Elô - Jennifer',
      statusMessage: statusInput.trim() || 'Disponível no Ecossistema Apple',
    });
    showSaveFeedback();
  };

  const showSaveFeedback = () => {
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-md transition-opacity">
      <div 
        className="relative w-full max-w-3xl h-[620px] bg-[#ffffff]/95 dark:bg-[#1e1e1e]/95 backdrop-blur-2xl rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] border border-black/[0.08] dark:border-white/[0.12] flex flex-col md:flex-row overflow-hidden text-[#1d1d1f] dark:text-[#f5f5f7] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Left Settings Sidebar (macOS System Settings Style) */}
        <div className="w-full md:w-64 bg-[#f6f6f7]/80 dark:bg-[#161616]/80 border-b md:border-b-0 md:border-r border-black/[0.06] dark:border-white/[0.08] p-4 flex flex-col justify-between shrink-0">
          <div>
            {/* macOS traffic light window dots */}
            <div className="flex items-center gap-2 mb-6">
              <button 
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e] hover:brightness-90 transition-all flex items-center justify-center group"
                aria-label="Fechar configurações"
              >
                <X className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100" />
              </button>
              <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
              <span className="ml-2 text-xs font-semibold text-black/50 dark:text-white/50 tracking-tight">
                Ajustes do Sistema
              </span>
            </div>

            {/* User Mini Card in Sidebar */}
            <div className="flex items-center gap-3 px-3 py-2.5 mb-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.04]">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-black/10 dark:ring-white/10 shrink-0 bg-neutral-200 dark:bg-neutral-800">
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate leading-tight">{profile.name}</p>
                <p className="text-[11px] text-black/50 dark:text-white/50 truncate">ID Apple Sincronizado</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#007aff] text-white shadow-sm'
                    : 'text-black/70 dark:text-white/70 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span>Foto de Perfil</span>
              </button>

              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'appearance'
                    ? 'bg-[#007aff] text-white shadow-sm'
                    : 'text-black/70 dark:text-white/70 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                }`}
              >
                <Sun className="w-4 h-4 shrink-0" />
                <span>Modo Claro / Escuro</span>
              </button>

              <button
                onClick={() => setActiveTab('apikeys')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'apikeys'
                    ? 'bg-[#007aff] text-white shadow-sm'
                    : 'text-black/70 dark:text-white/70 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                }`}
              >
                <Key className="w-4 h-4 shrink-0" />
                <span>Chaves de API</span>
              </button>
            </nav>
          </div>

          <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
            <p className="text-[10px] text-black/40 dark:text-white/40 tracking-wide text-center">
              macOS Sequoia & iOS 18 Design
            </p>
          </div>
        </div>

        {/* Right Settings Content Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#ffffff] dark:bg-[#1e1e1e]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                {activeTab === 'profile' && 'Alterar Foto e Informações de Perfil'}
                {activeTab === 'appearance' && 'Aparência e Modo de Exibição'}
                {activeTab === 'apikeys' && 'Gerenciamento de Chaves de API'}
              </h2>
              <p className="text-xs text-black/50 dark:text-white/50">
                {activeTab === 'profile' && 'Personalize a foto oficial e a identidade de Elô - Jennifer.'}
                {activeTab === 'appearance' && 'Escolha entre modo claro, modo escuro ou sincronização automática.'}
                {activeTab === 'apikeys' && 'Gere e controle chaves de integração seguras para seus serviços.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/[0.06] dark:hover:bg-white/[0.08] text-black/50 dark:text-white/50 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Toast Notification */}
          {isSavedToast && (
            <div className="mx-6 mt-3 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Alterações salvas com sucesso no ecossistema local.</span>
            </div>
          )}

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: Profile Photo & Details */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Active Photo Large Showcase */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#252528] border border-black/[0.04] dark:border-white/[0.06]">
                  <div className="relative group shrink-0">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white dark:ring-[#1e1e1e] shadow-md bg-neutral-200">
                      <img 
                        src={profile.avatarUrl} 
                        alt={profile.name} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs text-[10px] font-medium"
                      title="Fazer upload de nova foto"
                    >
                      <Camera className="w-5 h-5 mb-0.5" />
                      <span>Alterar</span>
                    </button>
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <h3 className="text-base font-semibold tracking-tight">{profile.name}</h3>
                    <p className="text-xs text-black/60 dark:text-white/60">
                      Foto em alta definição otimizada para o layout Apple. Escolha uma das opções refinadas abaixo ou importe a sua.
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white dark:bg-[#323236] border border-black/10 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-[#3a3a40] text-xs font-medium rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-black/60 dark:text-white/60" />
                        <span>Carregar do Computador</span>
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>
                  </div>
                </div>

                {/* Preset Avatars Selection */}
                <div>
                  <h4 className="text-xs font-semibold text-black/70 dark:text-white/70 mb-3 uppercase tracking-wider">
                    Coleção de Retratos Apple
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PRESET_AVATARS.map((avatar) => {
                      const isSelected = profile.avatarUrl === avatar.url;
                      return (
                        <button
                          key={avatar.id}
                          onClick={() => {
                            onProfileChange({ avatarUrl: avatar.url });
                            showSaveFeedback();
                          }}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-[#007aff] bg-[#007aff]/5 dark:bg-[#007aff]/10 ring-1 ring-[#007aff]'
                              : 'border-black/[0.08] dark:border-white/[0.08] hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                          }`}
                        >
                          <img 
                            src={avatar.url} 
                            alt={avatar.name} 
                            className="w-12 h-12 rounded-full object-cover ring-1 ring-black/10 dark:ring-white/10 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold truncate leading-tight flex items-center gap-1">
                              {avatar.name}
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#007aff] shrink-0" />}
                            </p>
                            <p className="text-[11px] text-black/50 dark:text-white/50 truncate mt-0.5">
                              {avatar.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom URL Input */}
                <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <label className="block text-xs font-medium text-black/70 dark:text-white/70 mb-1.5">
                    Ou insira uma URL de imagem externa
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://exemplo.com/minha-foto.jpg"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-white dark:bg-[#28282b] border border-black/10 dark:border-white/10 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#007aff]"
                    />
                    <button
                      onClick={handleApplyCustomUrl}
                      disabled={!customUrlInput.trim()}
                      className="px-4 py-2 bg-[#007aff] disabled:opacity-40 text-white text-xs font-medium rounded-lg hover:bg-[#006ee6] transition-colors"
                    >
                      Aplicar URL
                    </button>
                  </div>
                </div>

                {/* Edit Name & Status Section */}
                <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] space-y-3">
                  <h4 className="text-xs font-semibold text-black/70 dark:text-white/70 uppercase tracking-wider">
                    Identificação no Cabeçalho
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-black/60 dark:text-white/60 mb-1">
                        Nome de Exibição
                      </label>
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-[#28282b] border border-black/10 dark:border-white/10 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#007aff]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-black/60 dark:text-white/60 mb-1">
                        Status / Subtítulo
                      </label>
                      <input
                        type="text"
                        value={statusInput}
                        onChange={(e) => setStatusInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-[#28282b] border border-black/10 dark:border-white/10 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#007aff]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={handleSaveProfileInfo}
                      className="px-4 py-1.5 bg-[#007aff] text-white text-xs font-medium rounded-lg hover:bg-[#006ee6] transition-colors"
                    >
                      Salvar Identificação
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Appearance & Light/Dark Mode */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-black/70 dark:text-white/70 mb-4 uppercase tracking-wider">
                    Tema da Interface
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Light Mode Card */}
                    <button
                      onClick={() => onThemeChange('light')}
                      className={`group relative flex flex-col items-center p-4 rounded-2xl border text-center transition-all ${
                        theme === 'light'
                          ? 'border-[#007aff] bg-[#007aff]/5 dark:bg-[#007aff]/10 ring-2 ring-[#007aff]'
                          : 'border-black/[0.08] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20'
                      }`}
                    >
                      {/* Visual Mock of macOS Light Window */}
                      <div className="w-full h-24 rounded-lg bg-[#ffffff] border border-black/10 shadow-xs p-2 flex flex-col justify-between mb-3 overflow-hidden">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                          <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
                          <div className="w-2 h-2 rounded-full bg-[#28c840]" />
                        </div>
                        <div className="space-y-1.5 py-1">
                          <div className="w-3/4 h-2 bg-neutral-200 rounded-full" />
                          <div className="w-1/2 h-2 bg-neutral-100 rounded-full" />
                        </div>
                        <div className="w-1/3 h-2 bg-[#007aff] rounded-full self-end" />
                      </div>
                      <span className="text-xs font-semibold flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        Modo Claro
                      </span>
                      <span className="text-[11px] text-black/50 dark:text-white/50 mt-0.5">
                        Visual branco clean, alto contraste
                      </span>
                      {theme === 'light' && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#007aff] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>

                    {/* Dark Mode Card */}
                    <button
                      onClick={() => onThemeChange('dark')}
                      className={`group relative flex flex-col items-center p-4 rounded-2xl border text-center transition-all ${
                        theme === 'dark'
                          ? 'border-[#007aff] bg-[#007aff]/5 dark:bg-[#007aff]/10 ring-2 ring-[#007aff]'
                          : 'border-black/[0.08] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20'
                      }`}
                    >
                      {/* Visual Mock of macOS Dark Window */}
                      <div className="w-full h-24 rounded-lg bg-[#18181b] border border-white/10 shadow-xs p-2 flex flex-col justify-between mb-3 overflow-hidden">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                          <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
                          <div className="w-2 h-2 rounded-full bg-[#28c840]" />
                        </div>
                        <div className="space-y-1.5 py-1">
                          <div className="w-3/4 h-2 bg-neutral-700 rounded-full" />
                          <div className="w-1/2 h-2 bg-neutral-800 rounded-full" />
                        </div>
                        <div className="w-1/3 h-2 bg-[#007aff] rounded-full self-end" />
                      </div>
                      <span className="text-xs font-semibold flex items-center gap-1.5">
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        Modo Escuro
                      </span>
                      <span className="text-[11px] text-black/50 dark:text-white/50 mt-0.5">
                        Tons profundos de cinza e preto
                      </span>
                      {theme === 'dark' && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#007aff] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>

                    {/* Automatic / System Card */}
                    <button
                      onClick={() => onThemeChange('system')}
                      className={`group relative flex flex-col items-center p-4 rounded-2xl border text-center transition-all ${
                        theme === 'system'
                          ? 'border-[#007aff] bg-[#007aff]/5 dark:bg-[#007aff]/10 ring-2 ring-[#007aff]'
                          : 'border-black/[0.08] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20'
                      }`}
                    >
                      {/* Split Mock */}
                      <div className="w-full h-24 rounded-lg border border-black/10 dark:border-white/10 shadow-xs p-2 flex flex-col justify-between mb-3 overflow-hidden bg-gradient-to-r from-[#ffffff] via-[#ffffff] to-[#18181b] relative">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                          <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
                          <div className="w-2 h-2 rounded-full bg-[#28c840]" />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-black/40 dark:text-white/40 font-mono">
                          <span>Claro</span>
                          <span className="text-white/60">Escuro</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold flex items-center gap-1.5">
                        <Laptop className="w-3.5 h-3.5 text-neutral-500" />
                        Automático
                      </span>
                      <span className="text-[11px] text-black/50 dark:text-white/50 mt-0.5">
                        Segue o horário do seu Mac ou iPhone
                      </span>
                      {theme === 'system' && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#007aff] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* macOS Toggle Setting Row */}
                <div className="p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#252528] border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold">Alternância Rápida de Modo Escuro</p>
                    <p className="text-[11px] text-black/50 dark:text-white/50">
                      Mude imediatamente entre as paletas de cores do macOS.
                    </p>
                  </div>
                  {/* Apple Toggle Switch */}
                  <button
                    onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      theme === 'dark' ? 'bg-[#34c759]' : 'bg-neutral-300 dark:bg-neutral-600'
                    }`}
                    role="switch"
                    aria-checked={theme === 'dark'}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: API Keys */}
            {activeTab === 'apikeys' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-semibold text-black/70 dark:text-white/70 uppercase tracking-wider">
                      Chaves de Acesso e APIs
                    </h3>
                    <p className="text-xs text-black/50 dark:text-white/50">
                      Chaves geradas para conexão com assistentes, extensões e integrações externas.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsGeneratingKey(true)}
                    className="px-3.5 py-2 bg-[#007aff] hover:bg-[#006ee6] text-white text-xs font-medium rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Gerar Nova Chave</span>
                  </button>
                </div>

                {/* Form to create key */}
                {isGeneratingKey && (
                  <form 
                    onSubmit={handleCreateKey}
                    className="p-4 rounded-2xl bg-[#007aff]/5 dark:bg-[#007aff]/10 border border-[#007aff]/20 space-y-3 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#007aff] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Nova Chave de API Apple
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setIsGeneratingKey(false)}
                        className="text-xs text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
                      >
                        Cancelar
                      </button>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-black/60 dark:text-white/60 mb-1">
                        Nome / Propósito da Chave
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Assistente Elô Web, Automação Siri, Xcode App"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        autoFocus
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-[#28282b] border border-black/10 dark:border-white/10 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#007aff]"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsGeneratingKey(false)}
                        className="px-3 py-1.5 text-xs text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
                      >
                        Descartar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#007aff] text-white text-xs font-medium rounded-lg hover:bg-[#006ee6] shadow-2xs"
                      >
                        Confirmar e Gerar Chave
                      </button>
                    </div>
                  </form>
                )}

                {/* API Keys List */}
                <div className="space-y-3">
                  {apiKeys.length === 0 ? (
                    <div className="text-center py-8 px-4 border border-dashed border-black/10 dark:border-white/10 rounded-2xl">
                      <Key className="w-8 h-8 mx-auto text-black/30 dark:text-white/30 mb-2" />
                      <p className="text-xs font-semibold">Nenhuma chave de API gerada</p>
                      <p className="text-[11px] text-black/50 dark:text-white/50 mt-1 max-w-xs mx-auto">
                        Clique no botão acima para gerar sua primeira chave secreta de integração.
                      </p>
                    </div>
                  ) : (
                    apiKeys.map((item) => {
                      const isRevealed = revealedKeys[item.id];
                      const isCopied = copiedKeyId === item.id;
                      const displayKey = isRevealed 
                        ? item.key 
                        : `${item.key.slice(0, 10)}••••••••••••••••••••••••${item.key.slice(-4)}`;

                      return (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-xl bg-[#f5f5f7] dark:bg-[#252528] border border-black/[0.04] dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold truncate">{item.name}</span>
                              <span className="px-1.5 py-0.5 text-[9px] font-mono rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                Ativa
                              </span>
                            </div>
                            <div className="flex items-center gap-2 font-mono text-[11px] text-black/70 dark:text-white/70 bg-white dark:bg-[#1a1a1c] px-2.5 py-1 rounded-md border border-black/5 dark:border-white/5 max-w-full overflow-hidden">
                              <span className="truncate select-all">{displayKey}</span>
                              <button
                                onClick={() => toggleRevealKey(item.id)}
                                className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white p-0.5 shrink-0"
                                title={isRevealed ? "Ocultar chave" : "Revelar chave"}
                              >
                                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-black/40 dark:text-white/40">
                              <span>Criada em {item.createdAt}</span>
                              <span>·</span>
                              <span>Último uso: {item.lastUsedAt || 'Nunca utilizada'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                            <button
                              onClick={() => handleCopyKey(item.id, item.key)}
                              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#323236] border border-black/10 dark:border-white/10 text-xs font-medium hover:bg-neutral-50 dark:hover:bg-[#3a3a40] transition-colors flex items-center gap-1 shadow-2xs"
                              title="Copiar chave"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                  <span className="text-emerald-600 dark:text-emerald-400">Copiada</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-black/60 dark:text-white/60" />
                                  <span>Copiar</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => onDeleteApiKey(item.id)}
                              className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Revogar chave"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Apple Security Callout */}
                <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-start gap-3 text-xs text-neutral-600 dark:text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-[#007aff] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-800 dark:text-neutral-100">
                      Privacidade e Segurança Apple
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                      Suas chaves de API concedem acesso direto aos modelos de processamento local e na nuvem. Nunca as exponha em código público ou ferramentas inseguras.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer of modal */}
          <div className="px-6 py-3 border-t border-black/[0.06] dark:border-white/[0.08] bg-[#f9f9fb] dark:bg-[#1a1a1c] flex items-center justify-between">
            <span className="text-[11px] text-black/40 dark:text-white/40">
              Pressione Esc ou clique em Concluído para fechar
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#007aff] hover:bg-[#006ee6] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              Concluído
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
