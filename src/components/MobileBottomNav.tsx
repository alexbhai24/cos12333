import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Home,
  Video,
  MessageSquare,
  Wrench,
  ScanLine,
  Camera,
  Upload,
  X,
  CheckCircle2,
  BookOpen,
  Eye,
  Download,
  Zap,
  QrCode,
  MoreVertical,
  Image as ImageIcon,
  RotateCcw,
  RotateCw,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { PageRoute } from '../types';
import { syllabusNEET } from '../data/syllabusNEET';
import { syllabusJEE } from '../data/syllabusJEE';
import {
  detectDocumentCorners,
  detectQuestionCorners,
  verifyIsRealDocument,
  warpAndEnhanceDocument,
  segmentPageLayout,
  isDocumentOrTextPresent,
  DetectedBlock,
  QuadCorners
} from '../utils/scannerVision';

interface NavItem {
  id: PageRoute;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const BOTTOM_BAR_ROUTES: PageRoute[] = ['home', 'videos', 'posts', 'tools'];

const NAV_ITEMS: NavItem[] = [
  { id: 'home',   label: 'Home',  icon: Home },
  { id: 'videos', label: 'Video', icon: Video },
  { id: 'posts',  label: 'Posts', icon: MessageSquare },
  { id: 'tools',  label: 'Tools', icon: Wrench },
];

// ── Document & Question Scanner Sheet with Interactive Auto-Crop ────────────────
const ScannerSheet: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const stableCountRef = useRef(0);
  const stableCenterRef = useRef({ x: 0, y: 0 });

  // 3-Step Flow: 1 = Live Camera Scanner, 2 = Interactive Crop Screen, 3 = Syllabus & Details
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedExam, setSelectedExam] = useState<'neet' | 'jee'>('neet');

  // Camera stream state
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);

  // Captured raw image vs cropped final image
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  
  // AI Scanning Loading State
  const [isAILoading, setIsAILoading] = useState(false);
  const [rotation, setRotation] = useState<number>(0);

  // 4-Corner quad crop percentages (0..1)
  const [quadCorners, setQuadCorners] = useState<QuadCorners>({
    topLeft: { x: 0.05, y: 0.08 },
    topRight: { x: 0.95, y: 0.08 },
    bottomRight: { x: 0.95, y: 0.92 },
    bottomLeft: { x: 0.05, y: 0.92 }
  });

  // Dragging handles: corner, edge, or whole box move
  const [draggingHandle, setDraggingHandle] = useState<'tl' | 'tr' | 'br' | 'bl' | 'top' | 'right' | 'bottom' | 'left' | 'move' | null>(null);
  const [dragStart, setDragStart] = useState<{ relX: number; relY: number; initQuad: QuadCorners } | null>(null);

  // Form Fields
  const [note, setNote]       = useState('');
  const [mySlip, setMySlip]   = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation]     = useState('');
  const [done, setDone]       = useState(false);

  // Lightbox View Image
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // 3-Level Scanner Mode: 'off' (1:1 photo, zero lag), 'doc' (Document Quad Scanner), 'question' (Question AI Scanner)
  const [scanMode, setScanMode] = useState<'off' | 'doc' | 'question'>('off');

  const toggleScanMode = () => {
    setScanMode(prev => {
      if (prev === 'off') return 'doc';
      if (prev === 'doc') return 'question';
      return 'off';
    });
  };

  // Adobe Scan shutter flash & scanning trigger effect state
  const [isScanningFlash, setIsScanningFlash] = useState(false);
  const [autoScanEnabled, setAutoScanEnabled] = useState(false);

  // Live corner identification quad state (4 blue corner dots)
  const [detectedQuad, setDetectedQuad] = useState<{
    isDetected: boolean;
    topLeft: { x: number; y: number };
    topRight: { x: number; y: number };
    bottomRight: { x: number; y: number };
    bottomLeft: { x: number; y: number };
  }>({
    isDetected: false,
    topLeft: { x: 0.05, y: 0.08 },
    topRight: { x: 0.95, y: 0.08 },
    bottomRight: { x: 0.95, y: 0.92 },
    bottomLeft: { x: 0.05, y: 0.92 }
  });

  // Aggressive camera hardware stream kill function
  const stopCamera = () => {
    try {
      if (videoRef.current) {
        if (videoRef.current.srcObject) {
          const s = videoRef.current.srcObject as MediaStream;
          s.getTracks().forEach(track => {
            try {
              track.stop();
              track.enabled = false;
            } catch {}
          });
          videoRef.current.srcObject = null;
        }
      }
      if (stream) {
        stream.getTracks().forEach(track => {
          try {
            track.stop();
            track.enabled = false;
          } catch {}
        });
        setStream(null);
      }
    } catch (e) {
      console.warn('Camera stop error:', e);
    }
    setFlashlightOn(false);
    setHasCamera(false);
  };

  // Close scanner and ensure 100% hardware camera light kill
  const handleClose = () => {
    stopCamera();
    onClose();
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Syllabus mapping selection
  const currentSyllabus = selectedExam === 'neet' ? syllabusNEET : syllabusJEE;
  const validSubjects = useMemo(() => (currentSyllabus?.subjects || []).filter(Boolean), [currentSyllabus]);
  
  const [formSubjectId, setFormSubjectId] = useState(validSubjects[0]?.id || 'physics');
  
  const formSelectedSubject = useMemo(() => {
    return validSubjects.find(s => s.id === formSubjectId) || validSubjects[0];
  }, [validSubjects, formSubjectId]);

  const formChapters = useMemo(() => {
    return formSelectedSubject?.chapters || [];
  }, [formSelectedSubject]);

  const [formChapterId, setFormChapterId] = useState(formChapters[0]?.id || 'ch1');

  // Initialize live camera stream when in Step 1
  useEffect(() => {
    let currentStream: MediaStream | null = null;
    let isMounted = true;

    async function initCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      try {
        let mediaStream: MediaStream;
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { exact: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
          });
        } catch {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 }, height: { ideal: 480 } }
          });
        }
        currentStream = mediaStream;
        if (isMounted) {
          setStream(mediaStream);
          setHasCamera(true);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play().catch(() => {});
          }
        }
      } catch (err) {
        console.log('Camera error:', err);
        if (isMounted) setHasCamera(false);
      }
    }

    if (step === 1) {
      initCamera();
    } else {
      stopCamera();
    }

    return () => {
      isMounted = false;
      if (currentStream) {
        currentStream.getTracks().forEach(track => {
          try {
            track.stop();
            track.enabled = false;
          } catch {}
        });
      }
    };
  }, [step]);

  // Real-time local corner detection has been removed for a lag-free experience.
  // The frame will now be captured immediately upon shutter click and sent to AI.

  // Flashlight toggle handler
  const toggleFlashlight = async () => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      if (track) {
        try {
          const capabilities = (track as any).getCapabilities ? (track as any).getCapabilities() : {};
          if (capabilities?.torch) {
            await track.applyConstraints({ advanced: [{ torch: !flashlightOn }] as any });
            setFlashlightOn(!flashlightOn);
          } else {
            alert('Flashlight (Torch) is not supported on this browser/device.');
            setFlashlightOn(!flashlightOn); // Still toggle visually
          }
        } catch (err) {
          alert('Failed to toggle flashlight: ' + (err as Error).message);
          setFlashlightOn(!flashlightOn);
        }
      }
    }
  };

  // Helper to rotate rawImage data URL by 90 degrees clockwise or counter-clockwise
  const rotateRawImageCanvas = (clockwise: boolean) => {
    if (!rawImage) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.height;
      canvas.height = img.width;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((clockwise ? 90 : -90) * Math.PI / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const newDataUrl = canvas.toDataURL('image/jpeg', 0.94);
      setRawImage(newDataUrl);

      // Rotate quad corner coordinates
      setQuadCorners(prev => {
        if (clockwise) {
          return {
            topLeft: { x: 1 - prev.bottomLeft.y, y: prev.bottomLeft.x },
            topRight: { x: 1 - prev.topLeft.y, y: prev.topLeft.x },
            bottomRight: { x: 1 - prev.topRight.y, y: prev.topRight.x },
            bottomLeft: { x: 1 - prev.bottomRight.y, y: prev.bottomRight.x }
          };
        } else {
          return {
            topLeft: { x: prev.topRight.y, y: 1 - prev.topRight.x },
            topRight: { x: prev.bottomRight.y, y: 1 - prev.bottomRight.x },
            bottomRight: { x: prev.bottomLeft.y, y: 1 - prev.bottomLeft.x },
            bottomLeft: { x: prev.topLeft.y, y: 1 - prev.topLeft.x }
          };
        }
      });
    };
    img.src = rawImage;
  };

  // Capture video frame from camera & proceed to Crop Screen with Adobe Scan Shutter Flash
  const captureFrameToCrop = async () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const vw = video.videoWidth || 1280;
      const vh = video.videoHeight || 720;
      
      // Crop central 1:1 square from video stream to match 1:1 camera viewfinder ratio
      const sqSize = Math.min(vw, vh);
      const cropX = Math.round((vw - sqSize) / 2);
      const cropY = Math.round((vh - sqSize) / 2);

      const canvas = document.createElement('canvas');
      canvas.width = sqSize;
      canvas.height = sqSize;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, cropX, cropY, sqSize, sqSize, 0, 0, sqSize, sqSize);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.94);
        setRawImage(dataUrl);
        setRotation(0);

        // Turn off camera hardware immediately upon capturing photo frame
        stopCamera();

        // Adobe Scan Shutter Flash trigger
        setIsScanningFlash(true);
        setTimeout(() => {
          setIsScanningFlash(false);
        }, 320);

        if (scanMode === 'off') {
          // Normal 1:1 Photo Mode (full square crop bounds)
          setQuadCorners({
            topLeft: { x: 0.02, y: 0.02 },
            topRight: { x: 0.98, y: 0.02 },
            bottomRight: { x: 0.98, y: 0.98 },
            bottomLeft: { x: 0.02, y: 0.98 }
          });
          setStep(2);
          return;
        }

        // NORMAL CAMERA FALLBACK (NO AI)
        setQuadCorners({
          topLeft: { x: 0.05, y: 0.08 },
          topRight: { x: 0.95, y: 0.08 },
          bottomRight: { x: 0.95, y: 0.92 },
          bottomLeft: { x: 0.05, y: 0.92 }
        });
        setStep(2);
      }
    }
  };

  // Gallery File Upload with full vision detection parity
  const handleGalleryFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result as string;
      setRawImage(dataUrl);
      setRotation(0);
      stopCamera();

      if (scanMode === 'off') {
        setQuadCorners({
          topLeft: { x: 0.02, y: 0.02 },
          topRight: { x: 0.98, y: 0.02 },
          bottomRight: { x: 0.98, y: 0.98 },
          bottomLeft: { x: 0.02, y: 0.98 }
        });
        setStep(2);
        return;
      }

      // NORMAL CAMERA FALLBACK (NO AI)
      setQuadCorners({
        topLeft: { x: 0.05, y: 0.08 },
        topRight: { x: 0.95, y: 0.08 },
        bottomRight: { x: 0.95, y: 0.92 },
        bottomLeft: { x: 0.05, y: 0.92 }
      });
      setStep(2);
    };
    reader.readAsDataURL(f);
  };

  // Apply True 4-Corner Homography Perspective Crop to produce final scanner image
  const applyCropAndProceed = () => {
    if (!rawImage) {
      setStep(3);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const srcW = img.width;
      const srcH = img.height;

      const rotCanvas = document.createElement('canvas');
      rotCanvas.width = srcW;
      rotCanvas.height = srcH;
      const rotCtx = rotCanvas.getContext('2d');
      if (!rotCtx) {
        setCroppedImage(rawImage);
        setStep(3);
        return;
      }
      rotCtx.drawImage(img, 0, 0);

      // Define exact 4 corner coordinates from quadCorners percentages
      const corners: QuadCorners = {
        topLeft: { x: rotCanvas.width * quadCorners.topLeft.x, y: rotCanvas.height * quadCorners.topLeft.y },
        topRight: { x: rotCanvas.width * quadCorners.topRight.x, y: rotCanvas.height * quadCorners.topRight.y },
        bottomRight: { x: rotCanvas.width * quadCorners.bottomRight.x, y: rotCanvas.height * quadCorners.bottomRight.y },
        bottomLeft: { x: rotCanvas.width * quadCorners.bottomLeft.x, y: rotCanvas.height * quadCorners.bottomLeft.y }
      };

      // Perform true bilinear homography perspective transformation & document enhancement
      const warpedCanvas = warpAndEnhanceDocument(rotCanvas, corners, 'auto');
      const croppedUrl = warpedCanvas.toDataURL('image/jpeg', 0.94);
      setCroppedImage(croppedUrl);
      setStep(3); // Proceed to Syllabus & Details Step
    };
    img.onerror = () => {
      setCroppedImage(rawImage);
      setStep(3);
    };
    img.src = rawImage;
  };

  const handleDownloadImage = (url: string, filename = 'error_book_scan.png') => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = () => {
    if (!note.trim() && !croppedImage && !rawImage) return;

    const currentSubj = validSubjects.find(s => s.id === formSubjectId) || validSubjects[0];
    const currentCh = (currentSubj?.chapters || []).find(c => c.id === formChapterId) || currentSubj?.chapters[0];

    const finalImg = croppedImage || rawImage;

    try {
      const v2Existing = JSON.parse(localStorage.getItem('cosmic_mistake_entries_v2') || '[]');
      const newEntry = {
        id: 'm_' + Date.now(),
        exam: selectedExam,
        subjectId: currentSubj?.id || 'physics',
        subjectName: currentSubj?.name.replace(/\s*\(Theory:.*?\)/gi, '').trim() || 'Physics',
        chapterId: currentCh?.id || 'ch1',
        chapterTitle: currentCh?.title || 'General Chapter',
        topicTitle: 'Scanner Crop',
        sourceType: finalImg ? 'photo' : 'manual',
        sourceName: 'Scanner Camera',
        questionText: note.trim() || 'Scanned question',
        mySlip: mySlip || 'Captured via document scanner',
        correctAnswer: correctAnswer || 'Refer to explanation',
        explanation: explanation || 'Reviewed concept in Error Book',
        imageUrl: finalImg || undefined,
        isMastered: false,
        date: new Date().toISOString().split('T')[0]
      };
      v2Existing.unshift(newEntry);
      localStorage.setItem('cosmic_mistake_entries_v2', JSON.stringify(v2Existing));
    } catch {
      // ignore
    }

    handleClose();
  };

  // Lock body scroll when scanner is open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow || '';
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes scanLaserBeam {
          0% { top: 4%; opacity: 0.3; }
          50% { top: 92%; opacity: 1; }
          100% { top: 4%; opacity: 0.3; }
        }
      `}</style>
      
      {/* Fullscreen Overlay */}
      <div className="fixed inset-0 z-[99999] bg-[#070913] flex flex-col justify-between select-none font-sans overflow-hidden">
        
        {/* STEP 1: 1:1 RATIO ADOBE DOC SCANNER LIVE CAMERA VIEW */}
        {step === 1 && (
          <div className="relative w-full h-full flex flex-col justify-between p-4 bg-black">
            
            {/* Top Bar: Close Button, Dynamic Mode Badge, Mode Toggle & Flashlight */}
            <div className="relative z-30 flex items-center justify-between pt-2 px-2 gap-2">
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors border border-white/10 shrink-0"
                title="Close Scanner"
              >
                <X className="w-5 h-5" />
              </button>

              {/* 3-Level Scanner Mode Status Badge */}
              <div className="px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-lg border border-cyan-400/40 bg-[#101929]/90 text-cyan-300 transition-all">
                <p className="font-bold text-xs flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${
                    scanMode === 'question' ? 'bg-amber-400' : scanMode === 'doc' ? 'bg-cyan-400' : 'bg-emerald-400'
                  }`} />
                  <span>
                    {scanMode === 'off' && 'Normal Camera (1:1 Photo)'}
                    {scanMode === 'doc' && '📄 Document Mode — Auto Quad'}
                    {scanMode === 'question' && '❓ Question Mode — Auto Crop Card'}
                  </span>
                </p>
              </div>

              {/* Action Buttons: 3-Level Scanner Mode Toggle + Flashlight (ONLY Symbol Icons, No Text) */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={toggleScanMode}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border border-white/10 ${
                    scanMode === 'question'
                      ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.6)] ring-2 ring-amber-300'
                      : scanMode === 'doc'
                      ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.6)] ring-2 ring-cyan-300'
                      : 'bg-black/60 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/80'
                  }`}
                  title={
                    scanMode === 'off'
                      ? 'Normal Photo (Click to switch to Document Mode)'
                      : scanMode === 'doc'
                      ? 'Document Mode (Click to switch to Question Mode)'
                      : 'Question Mode (Click to switch to Normal Photo)'
                  }
                >
                  <Zap className="w-5 h-5 fill-current" />
                </button>

                {/* Eye Flashlight Torch Toggle Button */}
                <button
                  onClick={toggleFlashlight}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border border-white/10 ${
                    flashlightOn
                      ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.6)]'
                      : 'bg-black/60 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/80'
                  }`}
                  title="Toggle Flashlight Torch"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 1:1 Aspect Ratio Square Viewfinder Frame */}
            <div className="relative flex-1 my-3 flex items-center justify-center overflow-hidden">
              <div className="relative w-full max-w-sm sm:max-w-md aspect-square rounded-3xl overflow-hidden bg-black flex items-center justify-center border-2 border-cyan-400/50 shadow-[0_0_50px_rgba(0,240,255,0.25)]">
                
                {/* Live Camera Feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Live Tracking overlay removed to eliminate lag */}

                {/* Shutter Camera Flash Animation Overlay */}
                {isScanningFlash && (
                  <div className="absolute inset-0 z-50 bg-white/90 animate-pulse duration-200 pointer-events-none flex items-center justify-center">
                    <div className="p-4 rounded-full bg-cyan-500 text-black font-extrabold text-sm shadow-2xl flex items-center gap-2">
                      <ScanLine className="w-5 h-5 animate-spin" />
                      <span>Scanning Document...</span>
                    </div>
                  </div>
                )}

                {/* AI Scanning Loading Overlay (Removed) */}

                {/* Corner Frame Guidelines */}
                <div className="absolute inset-3 pointer-events-none z-30 transition-all duration-300 opacity-60">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg" />
                </div>
              </div>
            </div>

            {/* Bottom Shutter Capture + Upload Button */}
            <div className="relative z-30 flex flex-col items-center gap-4 pb-4">
              <button
                id="capture-shutter-btn"
                onClick={captureFrameToCrop}
                disabled={isScanningFlash}
                className="w-16 h-16 rounded-full bg-white p-1 shadow-2xl flex items-center justify-center active:scale-90 transition-transform ring-4 ring-cyan-500/30"
                title="Capture Document"
              >
                <div className="w-full h-full rounded-full border-2 border-black/20 bg-white hover:bg-cyan-50 transition-colors" />
              </button>

              <button
                onClick={() => galleryRef.current?.click()}
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-md border border-white/20 shadow-xl flex items-center gap-2 active:scale-95 transition-all"
              >
                <ImageIcon className="w-4 h-4 text-cyan-300" />
                <span>Upload from gallery</span>
              </button>

              <input
                ref={galleryRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleGalleryFile}
              />
            </div>
          </div>
        )}

        {/* STEP 2: RECREATED INTERACTIVE CROP TOOL WITH DRAGGABLE MOVE FUNCTION */}
        {step === 2 && (
          <div className="relative w-full h-full flex flex-col justify-between p-4 bg-[#070913] animate-in fade-in duration-200">
            {/* Top Bar */}
            <div className="relative z-30 flex items-center justify-between pt-2 px-2 border-b border-white/10 pb-3">
              <button
                onClick={() => {
                  stopCamera();
                  setRawImage(null);
                  setStep(1);
                }}
                className="p-2 rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
                title="Back to Camera"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2">
                <ScanLine className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">Interactive Crop & Adjust</span>
              </div>

              {/* Rotate Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => rotateRawImageCanvas(false)}
                  className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-amber-400 hover:bg-white/20 transition-colors"
                  title="Rotate Left"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => rotateRawImageCanvas(true)}
                  className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-amber-400 hover:bg-white/20 transition-colors"
                  title="Rotate Right"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Presets Bar */}
            <div className="flex items-center justify-center gap-2 py-2">
              <button
                type="button"
                onClick={() => setQuadCorners({
                  topLeft: { x: 0.02, y: 0.02 },
                  topRight: { x: 0.98, y: 0.02 },
                  bottomRight: { x: 0.98, y: 0.98 },
                  bottomLeft: { x: 0.02, y: 0.98 }
                })}
                className="px-3 py-1 rounded-lg bg-white/10 text-[11px] font-semibold text-white/80 hover:bg-amber-400 hover:text-black transition-colors"
              >
                Full Image
              </button>
              <button
                type="button"
                onClick={() => setQuadCorners({
                  topLeft: { x: 0.08, y: 0.15 },
                  topRight: { x: 0.92, y: 0.15 },
                  bottomRight: { x: 0.92, y: 0.70 },
                  bottomLeft: { x: 0.08, y: 0.70 }
                })}
                className="px-3 py-1 rounded-lg bg-white/10 text-[11px] font-semibold text-white/80 hover:bg-amber-400 hover:text-black transition-colors"
              >
                Question Box
              </button>
              <button
                type="button"
                onClick={() => setQuadCorners({
                  topLeft: { x: 0.08, y: 0.25 },
                  topRight: { x: 0.92, y: 0.25 },
                  bottomRight: { x: 0.92, y: 0.55 },
                  bottomLeft: { x: 0.08, y: 0.55 }
                })}
                className="px-3 py-1 rounded-lg bg-white/10 text-[11px] font-semibold text-white/80 hover:bg-amber-400 hover:text-black transition-colors"
              >
                Formula Strip
              </button>
            </div>

            {/* Interactive Image Container with 4 Independent Draggable Quad Corner Handles */}
            <div className="relative flex-1 my-2 flex items-center justify-center overflow-hidden">
              {rawImage && (
                <div
                  className="relative max-w-xs sm:max-w-sm aspect-square w-full mx-auto rounded-2xl overflow-hidden bg-black border border-white/20 select-none touch-none shadow-2xl flex items-center justify-center"
                  onPointerMove={(e) => {
                    if (!draggingHandle) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const relX = Math.max(0.01, Math.min(0.99, (e.clientX - rect.left) / rect.width));
                    const relY = Math.max(0.01, Math.min(0.99, (e.clientY - rect.top) / rect.height));

                    setQuadCorners(prev => {
                      let { topLeft, topRight, bottomRight, bottomLeft } = prev;
                      if (draggingHandle === 'tl') {
                        topLeft = { x: relX, y: relY };
                      } else if (draggingHandle === 'tr') {
                        topRight = { x: relX, y: relY };
                      } else if (draggingHandle === 'br') {
                        bottomRight = { x: relX, y: relY };
                      } else if (draggingHandle === 'bl') {
                        bottomLeft = { x: relX, y: relY };
                      } else if (draggingHandle === 'top') {
                        topLeft = { ...topLeft, y: relY };
                        topRight = { ...topRight, y: relY };
                      } else if (draggingHandle === 'bottom') {
                        bottomLeft = { ...bottomLeft, y: relY };
                        bottomRight = { ...bottomRight, y: relY };
                      } else if (draggingHandle === 'left') {
                        topLeft = { ...topLeft, x: relX };
                        bottomLeft = { ...bottomLeft, x: relX };
                      } else if (draggingHandle === 'right') {
                        topRight = { ...topRight, x: relX };
                        bottomRight = { ...bottomRight, x: relX };
                      }
                      return { topLeft, topRight, bottomRight, bottomLeft };
                    });
                  }}
                  onPointerUp={() => setDraggingHandle(null)}
                  onPointerLeave={() => setDraggingHandle(null)}
                >
                  <img
                    src={rawImage}
                    alt="Captured for crop"
                    className="w-full h-full object-contain pointer-events-none transition-all duration-200"
                  />

                  {/* SVG Document Boundary Polygon Mesh with Connecting Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon
                      points={`
                        ${quadCorners.topLeft.x * 100},${quadCorners.topLeft.y * 100} 
                        ${quadCorners.topRight.x * 100},${quadCorners.topRight.y * 100} 
                        ${quadCorners.bottomRight.x * 100},${quadCorners.bottomRight.y * 100} 
                        ${quadCorners.bottomLeft.x * 100},${quadCorners.bottomLeft.y * 100}
                      `}
                      fill="rgba(251, 191, 36, 0.22)"
                      stroke="#fbbf24"
                      strokeWidth="2.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>

                  {/* 4 Independent Corner Drag Handles */}
                  <div
                    onPointerDown={(e) => { e.stopPropagation(); setDraggingHandle('tl'); }}
                    style={{ left: `${quadCorners.topLeft.x * 100}%`, top: `${quadCorners.topLeft.y * 100}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-400 border-2 border-white shadow-2xl cursor-pointer touch-none flex items-center justify-center active:scale-125 transition-transform z-30"
                    title="Drag Top-Left Corner"
                  />
                  <div
                    onPointerDown={(e) => { e.stopPropagation(); setDraggingHandle('tr'); }}
                    style={{ left: `${quadCorners.topRight.x * 100}%`, top: `${quadCorners.topRight.y * 100}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-400 border-2 border-white shadow-2xl cursor-pointer touch-none flex items-center justify-center active:scale-125 transition-transform z-30"
                    title="Drag Top-Right Corner"
                  />
                  <div
                    onPointerDown={(e) => { e.stopPropagation(); setDraggingHandle('br'); }}
                    style={{ left: `${quadCorners.bottomRight.x * 100}%`, top: `${quadCorners.bottomRight.y * 100}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-400 border-2 border-white shadow-2xl cursor-pointer touch-none flex items-center justify-center active:scale-125 transition-transform z-30"
                    title="Drag Bottom-Right Corner"
                  />
                  <div
                    onPointerDown={(e) => { e.stopPropagation(); setDraggingHandle('bl'); }}
                    style={{ left: `${quadCorners.bottomLeft.x * 100}%`, top: `${quadCorners.bottomLeft.y * 100}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-400 border-2 border-white shadow-2xl cursor-pointer touch-none flex items-center justify-center active:scale-125 transition-transform z-30"
                    title="Drag Bottom-Left Corner"
                  />
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="relative z-30 flex flex-col items-center gap-3 pb-3">
              <div className="w-full flex items-center justify-between px-6 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    setRawImage(null);
                    setStep(1);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Scan</span>
                </button>

                <button
                  type="button"
                  onClick={applyCropAndProceed}
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Crop & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DETAILS & ADAPTIVE ASPECT RATIO PREVIEW (FIXES USER SCREENSHOT LETTERBOXING) */}
        {step === 3 && (
          <div className="relative w-full h-full flex flex-col justify-between p-5 overflow-y-auto custom-scrollbar bg-[#0d1226]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-bold text-base">Add to Error Book</span>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-full bg-white/10 text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-4">
              {/* ADAPTIVE CROPPED PHOTO PREVIEW (MATCHES EXACT CROPPED IMAGE ASPECT RATIO NO BLACK SIDE BARS) */}
              {croppedImage && (
                <div className="flex flex-col items-center justify-center my-1">
                  <div className="relative group inline-block max-w-full rounded-2xl overflow-hidden border border-cyan-400/40 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
                    <img
                      src={croppedImage}
                      alt="Cropped preview"
                      className="max-h-64 max-w-full w-auto h-auto object-contain rounded-2xl block"
                    />

                    {/* Centered Download / Lightbox Hover Bar */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setLightboxImage(croppedImage)}
                        className="w-10 h-10 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                        title="See Full / View Image"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadImage(croppedImage)}
                        className="w-10 h-10 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                        title="Download Image"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Top-Right Quick Badge */}
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20">
                      <button
                        type="button"
                        onClick={() => setLightboxImage(croppedImage)}
                        className="p-1 text-white/80 hover:text-cyan-400 transition-colors"
                        title="See Full / View Image"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadImage(croppedImage)}
                        className="p-1 text-white/80 hover:text-emerald-400 transition-colors"
                        title="Download Image"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Syllabus Mapping */}
              <div className="p-3.5 rounded-2xl bg-[#1c1f2e] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                    Syllabus Mapping
                  </span>
                  <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setSelectedExam('neet')}
                      className={`px-3 py-0.5 rounded text-[11px] font-bold ${
                        selectedExam === 'neet' ? 'bg-cyan-400 text-black' : 'text-white/60'
                      }`}
                    >
                      NEET
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedExam('jee')}
                      className={`px-3 py-0.5 rounded text-[11px] font-bold ${
                        selectedExam === 'jee' ? 'bg-cyan-400 text-black' : 'text-white/60'
                      }`}
                    >
                      JEE
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-white/60 block mb-1">Subject</label>
                    <select
                      value={formSubjectId}
                      onChange={(e) => {
                        const sId = e.target.value;
                        setFormSubjectId(sId);
                        const subj = validSubjects.find(s => s.id === sId);
                        if (subj?.chapters?.[0]) setFormChapterId(subj.chapters[0].id);
                      }}
                      className="w-full px-2.5 py-2 bg-[#121629] border border-white/15 rounded-xl text-xs text-white"
                    >
                      {validSubjects.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name.replace(/\s*\(Theory:.*?\)/gi, '').trim()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-white/60 block mb-1">Chapter</label>
                    <select
                      value={formChapterId}
                      onChange={(e) => setFormChapterId(e.target.value)}
                      className="w-full px-2.5 py-2 bg-[#121629] border border-white/15 rounded-xl text-xs text-white"
                    >
                      {formChapters.map(ch => (
                        <option key={ch.id} value={ch.id}>
                          {ch.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="space-y-3">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Describe the question, options, or error statement..."
                  rows={3}
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder:text-white/30"
                />

                <input
                  type="text"
                  placeholder="Where I Went Wrong (My Slip)"
                  value={mySlip}
                  onChange={(e) => setMySlip(e.target.value)}
                  className="w-full px-3 py-2 bg-rose-950/20 border border-rose-500/25 rounded-xl text-xs text-white placeholder:text-rose-200/30"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Correct Answer"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="w-full px-3 py-2 bg-emerald-950/20 border border-emerald-500/25 rounded-xl text-xs text-white placeholder:text-emerald-200/30"
                  />
                  <input
                    type="text"
                    placeholder="Explanation"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder:text-white/30"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold"
              >
                ← Retake Scan
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!note.trim() && !croppedImage && !rawImage}
                className="px-6 py-3 rounded-2xl font-bold text-xs transition-all flex items-center gap-2"
                style={{
                  background: (!note.trim() && !croppedImage && !rawImage)
                    ? 'rgba(255,255,255,0.06)'
                    : 'linear-gradient(135deg,#00f0ff 0%,#0080ff 100%)',
                  color: (!note.trim() && !croppedImage && !rawImage) ? 'rgba(255,255,255,0.3)' : '#000',
                  boxShadow: (!note.trim() && !croppedImage && !rawImage) ? 'none' : '0 0 24px rgba(0,240,255,0.35)',
                }}
              >
                {done ? (
                  <><CheckCircle2 className="w-4 h-4" /> Saved to Error Book!</>
                ) : (
                  <><BookOpen className="w-4 h-4" /> Save to Error Book</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* LIGHTBOX FULL IMAGE MODAL */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
              <button
                onClick={() => handleDownloadImage(lightboxImage)}
                className="flex items-center gap-1 text-xs font-bold text-white hover:text-emerald-400 transition-colors"
                title="Download Image"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>

              <div className="w-px h-4 bg-white/20" />

              <button
                onClick={() => setLightboxImage(null)}
                className="p-1 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={lightboxImage}
              alt="Full view"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const triggerHaptic = (pattern: number | number[] = 15) => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {}
  }
};

export const MobileBottomNav: React.FC = () => {
  const { currentRoute, setCurrentRoute } = useApp();
  const [scannerOpen, setScannerOpen] = useState(false);

  if (!BOTTOM_BAR_ROUTES.includes(currentRoute)) {
    return null;
  }

  const handleNav = (id: PageRoute) => {
    triggerHaptic(12);
    setCurrentRoute(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Content spacer */}
      <div className="h-28 lg:hidden" aria-hidden="true" />

      {/* ── Row: pill + scanner button ─────────────────────────────── */}
      <div
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9000] lg:hidden flex items-center gap-3"
        style={{ width: 'calc(100vw - 32px)', maxWidth: '420px' }}
      >
        {/* ── Dark pill with 4 nav items ── */}
        <nav
          className="flex-1 flex items-center px-2 py-2 rounded-[2rem] backdrop-blur-2xl"
          style={{
            background: 'rgba(8,10,22,0.88)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-[1.4rem] transition-all duration-250 outline-none select-none"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-[1.4rem]"
                    style={{
                      background: 'rgba(255,255,255,0.10)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                  />
                )}

                <span
                  className="relative z-10 flex items-center justify-center w-6 h-6 transition-all duration-250"
                  style={{
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.38)',
                    transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  }}
                >
                  <Icon className="w-5 h-5" />
                </span>

                <span
                  className="relative z-10 text-[9px] font-medium leading-none transition-all duration-250"
                  style={{ color: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)' }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ── Scanner circle button with upgraded glowing logo & haptic vibration ── */}
        <button
          onClick={() => {
            triggerHaptic([18, 35, 18]);
            setScannerOpen(true);
          }}
          aria-label="Scan and add to Error Book"
          className="group relative flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300 active:scale-90 hover:scale-105 outline-none select-none overflow-hidden"
          style={{
            width: '58px',
            height: '58px',
            background: 'linear-gradient(135deg, rgba(16,22,40,0.95) 0%, rgba(8,10,22,0.98) 100%)',
            border: '1px solid rgba(0,240,255,0.25)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.65), 0 0 20px rgba(0,240,255,0.2), inset 0 1px 1px rgba(255,255,255,0.15)',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {/* Subtle glowing ambient background pulse */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-amber-500/10 to-purple-500/10 opacity-70 group-hover:opacity-100 transition-opacity" />

          {/* Upgraded Futuristic Scanner Logo */}
          <svg
            width="28" height="28" viewBox="0 0 28 28" fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 transition-transform duration-300 group-hover:scale-110"
          >
            <defs>
              <linearGradient id="scannerLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
            
            {/* Top-Left Corner Bracket */}
            <path d="M4 10V5.5C4 4.67157 4.67157 4 5.5 4H10" stroke="url(#scannerLogoGrad)" strokeWidth="2.2" strokeLinecap="round"/>
            
            {/* Top-Right Corner Bracket */}
            <path d="M24 10V5.5C24 4.67157 23.3284 4 22.5 4H18" stroke="url(#scannerLogoGrad)" strokeWidth="2.2" strokeLinecap="round"/>
            
            {/* Bottom-Right Corner Bracket */}
            <path d="M24 18V22.5C24 23.3284 23.3284 24 22.5 24H18" stroke="url(#scannerLogoGrad)" strokeWidth="2.2" strokeLinecap="round"/>
            
            {/* Bottom-Left Corner Bracket */}
            <path d="M4 18V22.5C4 23.3284 4.67157 24 5.5 24H10" stroke="url(#scannerLogoGrad)" strokeWidth="2.2" strokeLinecap="round"/>
            
            {/* Center Laser Beam Line */}
            <line x1="7" y1="14" x2="21" y2="14" stroke="url(#scannerLogoGrad)" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="1 0.5" />
            
            {/* Plus / Target Center Reticle */}
            <circle cx="14" cy="14" r="2.5" fill="url(#scannerLogoGrad)" />
          </svg>
        </button>
      </div>

      {/* ── Add to Error Book Scanner Sheet ── */}
      {scannerOpen && <ScannerSheet onClose={() => setScannerOpen(false)} />}
    </>
  );
};
