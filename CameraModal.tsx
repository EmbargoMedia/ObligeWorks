
import React, { useRef, useEffect, useState } from 'react';
import { X, Camera, RefreshCw, Zap } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error("Camera access error:", err);
      setError("카메라 접근 권한이 필요합니다. 설정에서 카메라 권한을 허용해주세요.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      setIsCapturing(true);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const base64Image = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(base64Image);
        
        // Visual feedback
        setTimeout(() => {
          setIsCapturing(false);
          onClose();
        }, 300);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900 animate-in fade-in duration-300">
      <div className="absolute top-6 right-6 z-[210] flex gap-3">
        <button 
          onClick={startCamera}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white backdrop-blur-md transition-all"
          title="카메라 재시작"
        >
          <RefreshCw size={24} />
        </button>
        <button 
          onClick={onClose}
          className="p-3 bg-rose-500/20 hover:bg-rose-500/40 rounded-2xl text-white backdrop-blur-md transition-all"
        >
          <X size={24} />
        </button>
      </div>

      <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
        {error ? (
          <div className="max-w-xs text-center space-y-4 px-6">
            <div className="w-16 h-16 bg-rose-500/20 rounded-3xl flex items-center justify-center mx-auto text-rose-500">
              <Camera size={32} />
            </div>
            <p className="text-white font-bold">{error}</p>
            <button 
              onClick={startCamera}
              className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-black text-sm"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className={`w-full h-full object-cover transition-all duration-300 ${isCapturing ? 'brightness-150 scale-105' : ''}`}
            />
            
            {/* Viewfinder Overlay */}
            <div className="absolute inset-0 border-[2px] border-white/20 pointer-events-none m-8 rounded-[40px] flex items-center justify-center">
              <div className="w-12 h-12 border-t-2 border-l-2 border-white/40 absolute top-0 left-0 rounded-tl-[40px]"></div>
              <div className="w-12 h-12 border-t-2 border-r-2 border-white/40 absolute top-0 right-0 rounded-tr-[40px]"></div>
              <div className="w-12 h-12 border-b-2 border-l-2 border-white/40 absolute bottom-0 left-0 rounded-bl-[40px]"></div>
              <div className="w-12 h-12 border-b-2 border-r-2 border-white/40 absolute bottom-0 right-0 rounded-br-[40px]"></div>
              
              <div className="bg-white/5 backdrop-blur-[2px] px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                <Zap size={14} className="text-amber-400 animate-pulse" />
                <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Premium Lens Active</span>
              </div>
            </div>

            {/* Shutter Button */}
            <div className="absolute bottom-12 flex flex-col items-center gap-4">
              <button 
                onClick={capturePhoto}
                className="w-20 h-20 bg-white rounded-full p-1 shadow-2xl active:scale-90 transition-all group"
              >
                <div className="w-full h-full rounded-full border-[3px] border-slate-900/10 flex items-center justify-center group-hover:bg-slate-50">
                  <div className="w-14 h-14 bg-slate-900/5 rounded-full border border-slate-900/5"></div>
                </div>
              </button>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Tap to Capture</p>
            </div>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraModal;
