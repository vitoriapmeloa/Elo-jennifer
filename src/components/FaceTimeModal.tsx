import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, Shield } from 'lucide-react';
import { ProfileData } from '../types';

interface FaceTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  callType: 'audio' | 'video';
}

export const FaceTimeModal: React.FC<FaceTimeModalProps> = ({
  isOpen,
  onClose,
  profile,
  callType,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(callType === 'audio');
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isOpen) {
      setCallDuration(0);
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-sm rounded-[32px] overflow-hidden bg-[#161617] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] text-white flex flex-col items-center justify-between p-6 h-[480px]"
        role="dialog"
        aria-modal="true"
      >
        {/* Top bar */}
        <div className="w-full flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#34c759]" />
            <span>FaceTime Criptografado</span>
          </div>
          <span className="font-mono text-xs text-white/80">{formatDuration(callDuration)}</span>
        </div>

        {/* Center: Profile and Status */}
        <div className="flex flex-col items-center text-center my-auto">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white/10 shadow-2xl bg-neutral-800">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#34c759] border-2 border-[#161617] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            </span>
          </div>

          <h3 className="text-xl font-semibold tracking-tight">{profile.name}</h3>
          <p className="text-xs text-white/60 mt-1">
            {callType === 'video' && !isVideoDisabled ? 'FaceTime de Vídeo Conectado' : 'FaceTime de Áudio HD'}
          </p>
          <p className="text-[11px] text-white/40 mt-1">iCloud • Áudio Espacial Ativo</p>
        </div>

        {/* Bottom Control Bar (Apple Call Bar) */}
        <div className="w-full flex items-center justify-center gap-4 pt-4 border-t border-white/10">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isMuted ? 'bg-white text-black' : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={isMuted ? "Desativar Mudo" : "Ativar Mudo"}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsVideoDisabled(!isVideoDisabled)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isVideoDisabled ? 'bg-white/15 hover:bg-white/25 text-white/60' : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={isVideoDisabled ? "Ligar Câmera" : "Desligar Câmera"}
          >
            {isVideoDisabled ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="w-14 h-14 rounded-full bg-[#ff3b30] hover:bg-[#e0342a] text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
            title="Encerrar Ligação"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
