import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Play, Pause, RotateCcw, Volume2, VolumeX, Download, Sparkles, 
  Share2, Heart, MessageCircle, Music, ShieldCheck, CheckCircle2, 
  Camera, DollarSign, Lock, Zap, ArrowRight, Copy, Check, Smartphone, 
  Layers, Video, RefreshCw, Package, Truck, MapPin, Mic, MicOff, Bell
} from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';
import heroImg from '../assets/images/hero_community_taskers_1791345832504.jpg';
import escrowShieldImg from '../assets/images/escrow_shield_vault_1791345842180.jpg';

interface VideoAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSellModal?: () => void;
  onOpenPostTaskModal?: () => void;
}

const TOTAL_DURATION = 25; // seconds

const SCENES = [
  {
    id: 1,
    title: 'The Viral Hook',
    startTime: 0,
    endTime: 5,
    lyric: '♪ Got tasks? Got time? Stop leaving money on the line! ♪',
    heading: 'STOP WASTING MONEY!',
    subheading: 'Got items collecting dust or tasks you hate doing?',
    badge: 'VIRAL TIP: High-energy opening hook',
  },
  {
    id: 2,
    title: 'Sell & Ship or Local Pick-up',
    startTime: 5,
    endTime: 10,
    lyric: '♪ Snap a pic, sell it quick, ship nationwide or pick up quick! ♪',
    heading: 'SELL & SHIP NATIONWIDE OR PICK UP',
    subheading: 'USPS/UPS shipping + safe local pickup & doorstep delivery!',
    badge: '📦 Nationwide Shipping + 🚚 Local Delivery',
  },
  {
    id: 3,
    title: 'Got Tasks & Offer Services',
    startTime: 10,
    endTime: 15,
    lyric: '♪ Need a task done today? Verified neighbors on the way! ♪',
    heading: 'YOUR DIME, THEIR TIME',
    subheading: 'Name your price for yard work, repairs & errands',
    badge: '100% ID-Verified Neighbors',
  },
  {
    id: 4,
    title: 'Dime Vault™ & Daily Payouts',
    startTime: 15,
    endTime: 20,
    lyric: '♪ Dime Vault safe and sound — daily cash payouts go around! ♪',
    heading: 'DAILY CASH PAYOUTS',
    subheading: 'Google Pay · Cash App · PayPal · Chime · Stripe',
    badge: 'Automatic 6:00 PM Cycle',
  },
  {
    id: 5,
    title: 'Call to Action',
    startTime: 20,
    endTime: 25,
    lyric: '♪ My Time, Your Dime — get your cash every time! ♪',
    heading: 'MY TIME YOUR DIME',
    subheading: 'Turn items, skills, labor, and services into money',
    badge: 'Download / Tap Link In Bio',
  },
];

export const VideoAdModal: React.FC<VideoAdModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVocalLyricsEnabled, setIsVocalLyricsEnabled] = useState(true);
  const [platform, setPlatform] = useState<'tiktok' | 'shorts' | 'reels' | 'square'>('tiktok');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1'>('9:16');
  const [activeTab, setActiveTab] = useState<'player' | 'script' | 'captions'>('player');
  const [isLiked, setIsLiked] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Current Scene calculation
  const currentScene = SCENES.find(
    (s) => currentTime >= s.startTime && currentTime < s.endTime
  ) || SCENES[0];

  // Animation frame / playback loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      if (isPlaying) {
        const delta = (timestamp - lastTimestamp) / 1000;
        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= TOTAL_DURATION) {
            // Loop back to start
            audioSynth.playWhooshSound();
            return 0;
          }
          return next;
        });
      }
      lastTimestamp = timestamp;
      animationFrameId = requestAnimationFrame(loop);
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  // Sound effects and vocal lyrics trigger on scene changes
  const prevSceneIdRef = useRef<number>(currentScene.id);
  useEffect(() => {
    if (isPlaying && !isMuted && prevSceneIdRef.current !== currentScene.id) {
      if (currentScene.id === 2) {
        audioSynth.playCameraSound();
        setTimeout(() => audioSynth.playDoorbellSound(), 450);
      } else if (currentScene.id === 4) {
        audioSynth.playCashRegisterSound();
      } else if (currentScene.id === 5) {
        audioSynth.playFanfareSound();
      } else {
        audioSynth.playWhooshSound();
      }

      // Vocal speech synthesis sings / speaks the catchy lyrics on beat
      if (isVocalLyricsEnabled) {
        audioSynth.speakVocalLyric(currentScene.lyric);
      }
    }
    prevSceneIdRef.current = currentScene.id;
  }, [currentScene.id, isPlaying, isMuted, isVocalLyricsEnabled]);

  // Manage synth music playback
  const togglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      if (!isMuted) {
        audioSynth.startGroove();
      }
    } else {
      setIsPlaying(false);
      audioSynth.stopGroove();
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    if (!isPlaying) {
      setIsPlaying(true);
      if (!isMuted) {
        audioSynth.startGroove();
      }
    }
    audioSynth.playWhooshSound();
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioSynth.setVolume(0.75);
      if (isPlaying) audioSynth.startGroove();
    } else {
      setIsMuted(true);
      audioSynth.setVolume(0);
      audioSynth.stopGroove();
    }
  };

  // Clean up audio on close
  useEffect(() => {
    return () => {
      audioSynth.stopGroove();
    };
  }, []);

  const handleClose = () => {
    setIsPlaying(false);
    audioSynth.stopGroove();
    onClose();
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Video Export / Recording via HTML Canvas and MediaRecorder
  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRecording(true);
    setRecordProgress(0);
    setCurrentTime(0);
    setIsPlaying(true);
    audioSynth.startGroove();

    const stream = canvas.captureStream(30);
    const audioStream = audioSynth.getMediaStream();
    if (audioStream) {
      audioStream.getAudioTracks().forEach((track) => stream.addTrack(track));
    }

    recordedChunksRef.current = [];
    const mimeTypes = ['video/webm;codecs=vp9,opus', 'video/webm', 'video/mp4'];
    let selectedMime = 'video/webm';
    for (const m of mimeTypes) {
      if (MediaRecorder.isTypeSupported(m)) {
        selectedMime = m;
        break;
      }
    }

    try {
      const recorder = new MediaRecorder(stream, { mimeType: selectedMime });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: selectedMime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `MyTimeYourDime_TikTok_Shorts_Ad_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsRecording(false);
        setRecordProgress(0);
      };

      recorder.start(100);

      // Track recording progress for 25 seconds
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min(100, Math.round((elapsed / TOTAL_DURATION) * 100));
        setRecordProgress(progress);

        if (elapsed >= TOTAL_DURATION) {
          clearInterval(interval);
          recorder.stop();
          setIsPlaying(false);
          audioSynth.stopGroove();
        }
      }, 200);
    } catch {
      setIsRecording(false);
    }
  };

  // Render scenes to hidden canvas for video recording export
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;

    // Draw background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    if (currentScene.id === 1) {
      bgGradient.addColorStop(0, '#020617');
      bgGradient.addColorStop(0.5, '#052e16');
      bgGradient.addColorStop(1, '#000000');
    } else if (currentScene.id === 2) {
      bgGradient.addColorStop(0, '#064e3b');
      bgGradient.addColorStop(0.6, '#022c22');
      bgGradient.addColorStop(1, '#000000');
    } else if (currentScene.id === 3) {
      bgGradient.addColorStop(0, '#451a03');
      bgGradient.addColorStop(0.5, '#1e293b');
      bgGradient.addColorStop(1, '#020617');
    } else if (currentScene.id === 4) {
      bgGradient.addColorStop(0, '#000000');
      bgGradient.addColorStop(0.5, '#1e1b4b');
      bgGradient.addColorStop(1, '#042f2e');
    } else {
      bgGradient.addColorStop(0, '#022c22');
      bgGradient.addColorStop(0.5, '#451a03');
      bgGradient.addColorStop(1, '#000000');
    }
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative glow circles
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.35, 350, 0, Math.PI * 2);
    ctx.fillStyle = currentScene.id % 2 === 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)';
    ctx.fill();

    // Top Branding Bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.roundRect(80, 100, width - 160, 120, 30);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 50px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('MY TIME', 120, 180);

    ctx.fillStyle = '#f59e0b';
    ctx.fillText('YOUR DIME', 370, 180);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('★ OFFICIAL APP', width - 120, 180);

    // Main Heading
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 74px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(currentScene.heading, width / 2, 450);

    // Subheading
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '46px sans-serif';
    ctx.fillText(currentScene.subheading, width / 2, 540);

    // Center Stage Graphic Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.roundRect(100, 680, width - 200, 680, 40);
    ctx.fill();
    ctx.strokeStyle = currentScene.id === 2 ? '#10b981' : '#f59e0b';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Scene Specific Graphics in Canvas
    if (currentScene.id === 1) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 120px sans-serif';
      ctx.fillText('💸 ⚡ ⏰', width / 2, 920);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px sans-serif';
      ctx.fillText('Earn Money 3 Ways Today:', width / 2, 1060);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText('1. Sell Items with Photo', width / 2, 1140);
      ctx.fillText('2. Got Tasks? Hire a Neighbor', width / 2, 1210);
      ctx.fillText('3. Provide Your Services', width / 2, 1280);
    } else if (currentScene.id === 2) {
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 100px sans-serif';
      ctx.fillText('📸 📦 🚚 💵', width / 2, 910);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 50px sans-serif';
      ctx.fillText('SELL & SHIP NATIONWIDE OR PICK UP', width / 2, 1030);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText('📦 USPS/UPS Shipping · 📍 Local Pickup · 🚚 Delivery', width / 2, 1120);
      ctx.fillStyle = '#a7f3d0';
      ctx.font = '36px sans-serif';
      ctx.fillText('Buyer escrow locked in Dime Vault™ until delivery confirmed!', width / 2, 1210);
    } else if (currentScene.id === 3) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 120px sans-serif';
      ctx.fillText('🛠️ 🏡 🤝', width / 2, 920);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 56px sans-serif';
      ctx.fillText('Handyman · Yard Care · Errands', width / 2, 1060);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 46px sans-serif';
      ctx.fillText('100% ID-Verified Neighbors', width / 2, 1150);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '38px sans-serif';
      ctx.fillText('Name your price. Neighbors do the work!', width / 2, 1240);
    } else if (currentScene.id === 4) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 120px sans-serif';
      ctx.fillText('🛡️ 💳 ⚡', width / 2, 920);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px sans-serif';
      ctx.fillText('Guaranteed Daily Cash Payouts', width / 2, 1050);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 48px sans-serif';
      ctx.fillText('Google Pay · Cash App · PayPal · Chime', width / 2, 1140);
      ctx.fillStyle = '#a7f3d0';
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText('Daily 6:00 PM EST Disbursement', width / 2, 1230);
    } else {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 120px sans-serif';
      ctx.fillText('🚀 🌟 💰', width / 2, 920);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText('MY TIME YOUR DIME', width / 2, 1050);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText('Turn items, skills, labor into money!', width / 2, 1140);
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 50px sans-serif';
      ctx.fillText('👉 TAP LINK IN BIO / START NOW', width / 2, 1240);
    }

    // Karaoke Subtitle Bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.roundRect(80, 1460, width - 160, 160, 30);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#34d399';
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(currentScene.lyric, width / 2, 1555);

    // Call To Action Footer Button
    ctx.fillStyle = '#10b981';
    ctx.roundRect(140, 1680, width - 280, 120, 60);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('DOWNLOAD / JOIN FREE NOW ➔', width / 2, 1758);
  }, [currentTime, currentScene]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      {/* Hidden canvas used for high-res 1080x1920 video rendering and download */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-black via-slate-900 to-black border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-amber-400 to-black p-0.5 shadow-md">
              <div className="w-full h-full rounded-[10px] bg-black flex items-center justify-center">
                <Video className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-white text-base sm:text-lg">
                  TikTok, Shorts & Facebook Reels Ad Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  9:16 Vertical Video + Catchy Song + Vocals
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ready-to-advertise promo video with synchronized upbeat 128 BPM song, sung vocal lyrics & nationwide shipping/delivery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="hidden sm:flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('player')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'player' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Video Player
              </button>
              <button
                onClick={() => setActiveTab('script')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'script' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Script & Lyrics
              </button>
              <button
                onClick={() => setActiveTab('captions')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'captions' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Viral Captions
              </button>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {activeTab === 'player' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left / Center: The 9:16 Vertical Video Screen */}
              <div className="lg:col-span-6 flex flex-col items-center">
                
                {/* Platform & Format Switcher */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Platform:</span>
                  <button
                    onClick={() => { setPlatform('tiktok'); setAspectRatio('9:16'); }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      platform === 'tiktok'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    🎵 TikTok
                  </button>
                  <button
                    onClick={() => { setPlatform('shorts'); setAspectRatio('9:16'); }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      platform === 'shorts'
                        ? 'bg-red-600 text-white border-red-500 shadow-xs'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    🔴 Shorts
                  </button>
                  <button
                    onClick={() => { setPlatform('reels'); setAspectRatio('9:16'); }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      platform === 'reels'
                        ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    🔵 FB Reels
                  </button>
                  <button
                    onClick={() => { setPlatform('square'); setAspectRatio('1:1'); }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      platform === 'square'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    ⬛ 1:1 Feed
                  </button>
                </div>

                {/* THE PHONE / VIDEO CONTAINER */}
                <div 
                  className={`relative bg-black rounded-3xl border-4 border-slate-700/80 shadow-2xl overflow-hidden transition-all duration-300 ${
                    aspectRatio === '9:16' 
                      ? 'w-[320px] sm:w-[350px] h-[580px] sm:h-[620px]' 
                      : 'w-[340px] sm:w-[420px] h-[340px] sm:h-[420px]'
                  }`}
                >
                  {/* Background Scene Visuals */}
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-black to-slate-950 z-0">
                    {/* Scene 1: Hook */}
                    {currentScene.id === 1 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/60 via-black to-amber-950/40" />
                        <div className="relative z-10 space-y-3">
                          <span className="px-3 py-1 rounded-full bg-red-600/90 text-white font-black text-[11px] uppercase tracking-widest animate-pulse inline-block shadow-md">
                            ⚠️ STOP SCROLLING
                          </span>
                          <h4 className="text-2xl sm:text-3xl font-display font-black text-white leading-tight">
                            Got items collecting dust or tasks you hate doing?
                          </h4>
                          <div className="py-2 flex items-center justify-center gap-2">
                            <span className="text-4xl animate-bounce">💸</span>
                            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.15s' }}>📦</span>
                            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.3s' }}>🛠️</span>
                          </div>
                          <p className="text-xs font-bold text-amber-300 bg-black/60 px-3 py-1 rounded-lg border border-amber-400/30">
                            Stop leaving money on the table!
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Scene 2: Sell Items With Photo & Shipping / Delivery */}
                    {currentScene.id === 2 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center animate-in zoom-in-95 duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-black to-emerald-950/80" />
                        <div className="relative z-10 space-y-2.5 w-full">
                          <span className="px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[11px] uppercase tracking-widest inline-block shadow-md">
                            📸 SELL & SHIP NATIONWIDE
                          </span>
                          
                          {/* Mock Camera Viewfinder with Shipping badge */}
                          <div className="relative mx-auto w-48 h-36 bg-slate-900 rounded-2xl border-2 border-dashed border-emerald-400/70 p-2 overflow-hidden shadow-lg">
                            <img
                              src={heroImg}
                              alt="Item for sale"
                              className="w-full h-full object-cover rounded-xl opacity-80"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Camera className="w-9 h-9 text-amber-300 animate-ping" style={{ animationDuration: '2s' }} />
                            </div>
                            <span className="absolute top-2 left-2 bg-black/80 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded border border-amber-400/40 flex items-center gap-1">
                              <Package className="w-3 h-3 text-amber-400" />
                              <span>SHIPS IN 24H</span>
                            </span>
                            <span className="absolute bottom-2 right-2 bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded shadow">
                              +$185 SOLD!
                            </span>
                          </div>

                          <h4 className="text-lg sm:text-xl font-display font-black text-white leading-tight">
                            Snap Photo · Ship or Pick Up
                          </h4>

                          {/* Fulfillment badges */}
                          <div className="grid grid-cols-3 gap-1 text-[9px] font-bold">
                            <div className="bg-slate-900/90 border border-emerald-500/40 rounded-lg p-1 text-emerald-300 flex flex-col items-center">
                              <Package className="w-3.5 h-3.5 mb-0.5 text-emerald-400" />
                              <span>📦 Ships USPS</span>
                            </div>
                            <div className="bg-slate-900/90 border border-amber-500/40 rounded-lg p-1 text-amber-300 flex flex-col items-center">
                              <MapPin className="w-3.5 h-3.5 mb-0.5 text-amber-400" />
                              <span>📍 Safe Pick-Up</span>
                            </div>
                            <div className="bg-slate-900/90 border border-sky-500/40 rounded-lg p-1 text-sky-300 flex flex-col items-center">
                              <Truck className="w-3.5 h-3.5 mb-0.5 text-sky-400" />
                              <span>🚚 Delivery</span>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-200">
                            Buyer funds held in Dime Vault™ until delivery confirmed!
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Scene 3: Got Tasks & Offer Services */}
                    {currentScene.id === 3 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-in slide-in-from-bottom-5 duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/60 via-slate-950 to-black" />
                        <div className="relative z-10 space-y-3 w-full">
                          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-widest inline-block shadow-md">
                            🤝 NEIGHBOR LABOR & TASKS
                          </span>

                          <div className="space-y-2 text-left">
                            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-xs">
                              <span className="font-bold text-white">🏡 Lawn Mowing & Cleanup</span>
                              <span className="font-black text-emerald-400">$85 Cash</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-amber-500/40 text-xs">
                              <span className="font-bold text-white">🔧 Handyman Home Repair</span>
                              <span className="font-black text-amber-300">$150 Cash</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs">
                              <span className="font-bold text-white">📦 Moving Heavy Furniture</span>
                              <span className="font-black text-emerald-400">$120 Cash</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-bold">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>100% ID-Verified Neighbors Only</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Scene 4: Dime Vault & Daily Payouts */}
                    {currentScene.id === 4 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/60 via-slate-950 to-emerald-950/60" />
                        <div className="relative z-10 space-y-3">
                          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <img
                              src={escrowShieldImg}
                              alt="Dime Vault Escrow"
                              className="w-12 h-12 object-cover rounded-xl"
                            />
                          </div>

                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-[11px] uppercase tracking-widest inline-block border border-emerald-500/40">
                            GUARANTEED DAILY PAYOUTS
                          </span>

                          <h4 className="text-2xl font-display font-black text-white">
                            Direct To Your Card Every Day
                          </h4>

                          {/* Digital payment badges */}
                          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                            <span className="px-2.5 py-1 rounded-lg bg-black/80 border border-slate-700 text-[11px] font-bold text-blue-400">
                              Google Pay
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-black/80 border border-slate-700 text-[11px] font-bold text-emerald-400">
                              Cash App
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-black/80 border border-slate-700 text-[11px] font-bold text-sky-400">
                              PayPal
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-black/80 border border-slate-700 text-[11px] font-bold text-green-400">
                              Chime
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-300">
                            Daily 6:00 PM EST automated cashouts. Zero scam risk!
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Scene 5: Grand Finale Call to Action */}
                    {currentScene.id === 5 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-105 duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-black to-amber-950" />
                        <div className="relative z-10 space-y-3">
                          <span className="px-3 py-1 rounded-full bg-amber-400 text-black font-black text-[11px] uppercase tracking-widest inline-block shadow-md animate-bounce">
                            ★ DOWNLOAD & START TODAY ★
                          </span>

                          <h4 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white drop-shadow-md">
                            <span className="text-emerald-400">My Time</span>{' '}
                            <span className="text-amber-400">Your Dime</span>
                          </h4>

                          <p className="text-xs font-bold text-slate-200">
                            Turn items, skills, labor, and services into money.
                          </p>

                          <div className="pt-2">
                            <button
                              onClick={() => {
                                handleClose();
                              }}
                              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-emerald-500/20 hover:scale-105 transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <span>TAP LINK IN BIO / START NOW</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* TIKTOK / SHORTS UI OVERLAYS (Watermark, Side Buttons, Sound Tag) */}
                  <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-4 text-white">
                    
                    {/* Top Sound Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/80 text-[11px]">
                        <Music className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                        <span className="font-bold text-slate-200">
                          My Time Your Dime · Viral Anthem (128 BPM)
                        </span>
                      </div>
                      <div className="px-2 py-0.5 rounded bg-amber-500 text-black font-black text-[10px]">
                        AD
                      </div>
                    </div>

                    {/* Right Side Social Actions (Like, Comment, Share, Sound Disc) */}
                    <div className="self-end flex flex-col items-center gap-3 pointer-events-auto">
                      <button
                        onClick={() => setIsLiked(!isLiked)}
                        className="flex flex-col items-center cursor-pointer group"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isLiked ? 'bg-red-500 text-white' : 'bg-black/60 text-white hover:bg-black/80'
                        }`}>
                          <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
                        </div>
                        <span className="text-[10px] font-bold mt-1 text-white drop-shadow">
                          {isLiked ? '142.9K' : '142.8K'}
                        </span>
                      </button>

                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold mt-1 text-white drop-shadow">
                          2,840
                        </span>
                      </div>

                      <button
                        onClick={() => copyToClipboard('https://mytimeyourdime.app', 'share')}
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors">
                          <Share2 className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold mt-1 text-white drop-shadow">
                          {copiedKey === 'share' ? 'Copied!' : '48.2K'}
                        </span>
                      </button>

                      {/* Spinning Vinyl Record Disc */}
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-500 p-1 shadow-lg ${
                        isPlaying ? 'animate-spin' : ''
                      }`} style={{ animationDuration: '3s' }}>
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-amber-400" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom User Handle, Caption & Synchronized Lyric Subtitles */}
                    <div className="space-y-2 pointer-events-auto">
                      
                      {/* Synchronized Karaoke Lyrics Subtitle Pill */}
                      <div className="bg-black/90 border border-emerald-400/80 rounded-xl px-3 py-2 text-center shadow-lg">
                        <p className="text-xs sm:text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-yellow-200 to-amber-400 animate-pulse">
                          {currentScene.lyric}
                        </p>
                      </div>

                      {/* Account info */}
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-sm text-white">
                          @MyTimeYourDimeApp
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                        <span className="text-[10px] font-bold bg-white text-black px-2 py-0.5 rounded-full">
                          Follow
                        </span>
                      </div>

                      {/* Caption */}
                      <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                        Turn items, skills, labor, and services into money! 💵 100% Dime Vault™ Escrow + Daily payouts to Google Pay, Cash App, PayPal, and Chime! #MyTimeYourDime #SideHustle #DailyCash
                      </p>

                      {/* Timeline Scrubber */}
                      <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-amber-400 h-full transition-all duration-100"
                          style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Video Playback Controls Bar */}
                <div className="w-full max-w-[360px] mt-4 flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>

                    <button
                      onClick={handleRestart}
                      className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                      title="Replay from start"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={toggleMute}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        isMuted
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'bg-slate-800 text-amber-400 hover:bg-slate-700'
                      }`}
                      title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {/* Vocal Lyrics Toggle */}
                    <button
                      onClick={() => {
                        const next = !isVocalLyricsEnabled;
                        setIsVocalLyricsEnabled(next);
                        if (!next) {
                          audioSynth.stopVoice();
                        } else if (isPlaying && !isMuted) {
                          audioSynth.speakVocalLyric(currentScene.lyric);
                        }
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        isVocalLyricsEnabled
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title={isVocalLyricsEnabled ? 'Audible Vocal Lyrics: ON' : 'Audible Vocal Lyrics: OFF'}
                    >
                      {isVocalLyricsEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-slate-300">
                      0:{Math.floor(currentTime).toString().padStart(2, '0')} / 0:25
                    </span>
                    <p className="text-[10px] text-emerald-400 font-semibold">
                      Scene {currentScene.id} of 5
                    </p>
                  </div>
                </div>

              </div>

              {/* Right Column: Scenes Navigator, Sound Effects Board & Download */}
              <div className="lg:col-span-6 space-y-4">
                
                {/* Download / Export Action Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/70 border-2 border-amber-400/50 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-black text-white text-sm sm:text-base flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Export Video File for TikTok & Shorts</span>
                      </h4>
                      <p className="text-xs text-slate-300">
                        Record and download an actual high-res video file with the catchy soundtrack!
                      </p>
                    </div>
                  </div>

                  {isRecording ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-amber-400 flex items-center gap-1.5 animate-pulse">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Rendering video scenes & audio ({recordProgress}%)...</span>
                        </span>
                        <span className="text-slate-400">Please wait</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full transition-all duration-200"
                          style={{ width: `${recordProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleExportVideo}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer border border-emerald-400/40"
                    >
                      <Download className="w-4 h-4 text-amber-300" />
                      <span>Download Video File (.webm / 9:16 Vertical)</span>
                    </button>
                  )}
                </div>

                {/* Scene Breakdown Navigation */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-display font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>Storyboards & Scene Timeline</span>
                    </h5>
                    <span className="text-[11px] text-slate-400">Click to jump</span>
                  </div>

                  <div className="space-y-2">
                    {SCENES.map((scene) => {
                      const isActive = currentScene.id === scene.id;
                      return (
                        <button
                          key={scene.id}
                          onClick={() => {
                            setCurrentTime(scene.startTime);
                            if (!isPlaying) {
                              setIsPlaying(true);
                              if (!isMuted) audioSynth.startGroove();
                            }
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            isActive
                              ? 'bg-slate-950 border-amber-400/80 shadow-md ring-1 ring-amber-400/30'
                              : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-950'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                              isActive ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {scene.id}
                            </span>
                            <div className="min-w-0">
                              <p className={`text-xs font-bold truncate ${isActive ? 'text-amber-300' : 'text-slate-200'}`}>
                                {scene.title}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate">
                                {scene.heading}
                              </p>
                            </div>
                          </div>

                          <span className="text-[10px] font-mono font-bold text-slate-500 whitespace-nowrap">
                            0:{scene.startTime.toString().padStart(2, '0')} - 0:{scene.endTime.toString().padStart(2, '0')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sound Effects Board */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                  <h5 className="font-display font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sound Effects & Catchy Music Deck</span>
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <button
                      onClick={() => audioSynth.playCameraSound()}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center transition-all cursor-pointer"
                    >
                      <Camera className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
                      <span className="text-[10px] font-bold text-slate-300 block">Camera Click</span>
                    </button>

                    <button
                      onClick={() => audioSynth.playDoorbellSound()}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center transition-all cursor-pointer"
                    >
                      <Bell className="w-4 h-4 mx-auto text-amber-300 mb-1" />
                      <span className="text-[10px] font-bold text-slate-300 block">Doorbell Ding</span>
                    </button>

                    <button
                      onClick={() => audioSynth.playCashRegisterSound()}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center transition-all cursor-pointer"
                    >
                      <DollarSign className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                      <span className="text-[10px] font-bold text-slate-300 block">Cha-Ching!</span>
                    </button>

                    <button
                      onClick={() => audioSynth.playWhooshSound()}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center transition-all cursor-pointer"
                    >
                      <Zap className="w-4 h-4 mx-auto text-sky-400 mb-1" />
                      <span className="text-[10px] font-bold text-slate-300 block">Whoosh Beat</span>
                    </button>

                    <button
                      onClick={() => audioSynth.playFanfareSound()}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 mx-auto text-yellow-300 mb-1" />
                      <span className="text-[10px] font-bold text-slate-300 block">Fanfare</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Tab 2: Script & Timing */}
          {activeTab === 'script' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-display font-black text-white text-base">
                    Full Video Ad Voiceover & Creator Script
                  </h4>
                  <p className="text-xs text-slate-400">
                    Use this script if you want to record yourself or a creator speaking over the video
                  </p>
                </div>
                <button
                  onClick={() => {
                    const fullScript = SCENES.map((s) => `[0:${s.startTime.toString().padStart(2, '0')}] ${s.title.toUpperCase()}\nVisual: ${s.heading} - ${s.subheading}\nVoiceover/Song: "${s.lyric}"`).join('\n\n');
                    copyToClipboard(fullScript, 'full_script');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'full_script' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'full_script' ? 'Copied Script!' : 'Copy Script'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {SCENES.map((s) => (
                  <div key={s.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-amber-400">
                        Scene {s.id}: {s.title} (0:{s.startTime.toString().padStart(2, '0')} - 0:{s.endTime.toString().padStart(2, '0')})
                      </span>
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        {s.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      <strong>On-Screen Text:</strong> {s.heading} — {s.subheading}
                    </p>
                    <p className="text-xs text-yellow-200 font-semibold bg-black/40 p-2 rounded-lg border border-slate-800">
                      <strong>Catchy Song / Audio Lyric:</strong> {s.lyric}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Ready Viral Captions & Hashtags */}
          {activeTab === 'captions' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <h4 className="font-display font-black text-white text-base">
                  Pre-Written Viral Captions & Tags
                </h4>
                <p className="text-xs text-slate-400">
                  Copy and paste directly into TikTok, YouTube Shorts, and Instagram Reels
                </p>
              </div>

              {/* TikTok Caption */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>TikTok Caption (High Engagement + Shipping)</span>
                  </span>
                  <button
                    onClick={() => {
                      const text = `Got stuff collecting dust or chores you hate doing? 💸 My Time Your Dime lets you sell items with a photo, SHIP nationwide with tracking 📦, or do safe local pickup & doorstep delivery! Plus get tasks done or offer skills with daily payouts to Google Pay, Cash App, PayPal, and Chime! 100% Dime Vault™ Escrow safe! Link in bio! 🚀 #MyTimeYourDime #SideHustle #EarnMoney #GigEconomy #GotTasks #SellItems #NationwideShipping #Shorts`;
                      copyToClipboard(text, 'tiktok_caption');
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'tiktok_caption' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'tiktok_caption' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 font-mono bg-black/50 p-3 rounded-lg border border-slate-800 leading-relaxed">
                  Got stuff collecting dust or chores you hate doing? 💸 My Time Your Dime lets you sell items with a photo, SHIP nationwide with tracking 📦, or do safe local pickup & doorstep delivery! Plus get tasks done or offer skills with daily payouts to Google Pay, Cash App, PayPal, and Chime! 100% Dime Vault™ Escrow safe! Link in bio! 🚀 #MyTimeYourDime #SideHustle #EarnMoney #GigEconomy #GotTasks #SellItems #NationwideShipping #Shorts
                </p>
              </div>

              {/* YouTube Shorts Title & Description */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-red-400 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" />
                    <span>YouTube Shorts Title & Description</span>
                  </span>
                  <button
                    onClick={() => {
                      const text = `Title: Turn Your Clutter & Free Time Into Daily Cash! 💵 #Shorts\n\nDescription: Sell items with a photo (Ship Nationwide with USPS/UPS or choose safe local pick-up & delivery), post tasks, or provide services on My Time Your Dime. Escrow protection & daily payouts to Cash App, Google Pay, PayPal & Chime! #MyTimeYourDime #SideHustle #Shorts #EarnMoney`;
                      copyToClipboard(text, 'yt_caption');
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'yt_caption' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'yt_caption' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="space-y-1 text-xs font-mono bg-black/50 p-3 rounded-lg border border-slate-800">
                  <p className="text-amber-300 font-bold">Title: Turn Your Clutter & Free Time Into Daily Cash! 💵 #Shorts</p>
                  <p className="text-slate-300 pt-1">Description: Sell items with a photo (Ship Nationwide with USPS/UPS or choose safe local pick-up & delivery), post tasks, or provide services on My Time Your Dime. Escrow protection & daily payouts to Cash App, Google Pay, PayPal & Chime! #MyTimeYourDime #SideHustle #Shorts #EarnMoney</p>
                </div>
              </div>

              {/* Facebook Reels Dedicated Viral Caption */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-400 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Facebook Reels Viral Post & Caption</span>
                  </span>
                  <button
                    onClick={() => {
                      const text = `Stop leaving money on the table! 💰 My Time Your Dime turns items, skills, labor, and services into money!\n\n✨ HOW IT WORKS:\n📸 Sell items with a photo — Ship nationwide or choose safe local pick-up & delivery!\n🤝 Got tasks? Hire verified neighbors for yard care, moving, home repairs, or errands.\n⚡ Provide your skills and get paid daily to your Cash App, Google Pay, PayPal, or Chime!\n🛡️ 100% Dime Vault™ escrow protection.\n\n👉 Download and start earning today: https://mytimeyourdime.app\n\n#MyTimeYourDime #FacebookReels #Reels #SideHustle #WorkFromHome #EarnMoney #GigEconomy #GotTasks #BuyAndSell #LocalServices`;
                      copyToClipboard(text, 'fb_reels');
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'fb_reels' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'fb_reels' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-xs font-mono bg-black/50 p-3 rounded-lg border border-slate-800 text-slate-300 whitespace-pre-line leading-relaxed">
                  Stop leaving money on the table! 💰 My Time Your Dime turns items, skills, labor, and services into money!
                  {'\n\n'}
                  ✨ HOW IT WORKS:
                  {'\n'}📸 Sell items with a photo — Ship nationwide or choose safe local pick-up & delivery!
                  {'\n'}🤝 Got tasks? Hire verified neighbors for yard care, moving, home repairs, or errands.
                  {'\n'}⚡ Provide your skills and get paid daily to your Cash App, Google Pay, PayPal, or Chime!
                  {'\n'}🛡️ 100% Dime Vault™ escrow protection.
                  {'\n\n'}👉 Download and start earning today: https://mytimeyourdime.app
                  {'\n\n'}#MyTimeYourDime #FacebookReels #Reels #SideHustle #WorkFromHome #EarnMoney #GigEconomy #GotTasks #BuyAndSell #LocalServices
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
