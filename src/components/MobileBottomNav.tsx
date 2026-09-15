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
  warpAndEnhanceDocument,
  segmentPageLayout,
  isDocumentOrTextPresent,
  DetectedBlock
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
  const [rotation, setRotation] = useState<number>(0);

  // Crop box bounding rectangle percentages (x, y, w, h)
  const [cropBox, setCropBox] = useState({ x: 0.05, y: 0.08, w: 0.9, h: 0.82 });

  // Dragging handles: corner, edge, or whole box move
  const [draggingHandle, setDraggingHandle] = useState<'tl' | 'tr' | 'br' | 'bl' | 'top' | 'right' | 'bottom' | 'left' | 'move' | null>(null);
  const [dragStart, setDragStart] = useState<{ relX: number; relY: number; boxX: number; boxY: number } | null>(null);

  // Form Fields
  const [note, setNote]       = useState('');
  const [mySlip, setMySlip]   = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation]     = useState('');
  const [done, setDone]       = useState(false);

  // Lightbox View Image
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Live real-time document auto-detection state
  const [detectedBox, setDetectedBox] = useState<{
    isDetected: boolean;
    x: number;
    y: number;
    w: number;
    h: number;
    confidence: number;
  }>({ isDetected: false, x: 0.05, y: 0.08, w: 0.9, h: 0.82, confidence: 0 });

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

  // Real-time camera detection loop (runs while in Step 1)
  useEffect(() => {
    if (step !== 1) return;

    let animFrameId: number;
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');

    const sampleFrame = () => {
      if (videoRef.current && videoRef.current.readyState === 4 && ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 320, 240);
        const corners = detectDocumentCorners(canvas, 0.05);
        const textPresent = isDocumentOrTextPresent(canvas);

        const w = (corners.bottomRight.x - corners.topLeft.x) / 320;
        const h = (corners.bottomRight.y - corners.topLeft.y) / 240;
        const x = corners.topLeft.x / 320;
        const y = corners.topLeft.y / 240;

        if (textPresent && w > 0.25 && h > 0.25) {
          setDetectedBox({
            isDetected: true,
            x: Math.max(0.02, x),
            y: Math.max(0.02, y),
            w: Math.min(0.96, w),
            h: Math.min(0.96, h),
            confidence: 0.92
          });
        } else {
          setDetectedBox(prev => ({ ...prev, isDetected: false }));
        }
      }
      animFrameId = requestAnimationFrame(sampleFrame);
    };

    const timer = setTimeout(() => {
      sampleFrame();
    }, 400);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animFrameId);
    };
  }, [step]);

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
            video: { facingMode: { exact: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }
          });
        } catch {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
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

  // Flashlight toggle handler
  const toggleFlashlight = async () => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      if (track) {
        try {
          const capabilities = (track as any).getCapabilities ? (track as any).getCapabilities() : {};
          if (capabilities?.torch) {
            await track.applyConstraints({ advanced: [{ torch: !flashlightOn }] as any });
          }
          setFlashlightOn(!flashlightOn);
        } catch {
          setFlashlightOn(!flashlightOn);
        }
      }
    }
  };

  // Capture video frame from camera & proceed to Crop Screen
  const captureFrameToCrop = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Auto-detect quad corners for crop box
        const corners = detectDocumentCorners(canvas);
        const w = canvas.width;
        const h = canvas.height;
        if (w > 0 && h > 0 && (corners.bottomRight.x - corners.topLeft.x) > w * 0.2) {
          setCropBox({
            x: Math.max(0.02, corners.topLeft.x / w),
            y: Math.max(0.02, corners.topLeft.y / h),
            w: Math.min(0.96, (corners.bottomRight.x - corners.topLeft.x) / w),
            h: Math.min(0.96, (corners.bottomRight.y - corners.topLeft.y) / h)
          });
        } else {
          setCropBox({ x: 0.05, y: 0.08, w: 0.9, h: 0.82 });
        }

        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setRawImage(dataUrl);
        setRotation(0);

        // Turn off camera hardware light immediately upon capturing frame
        stopCamera();
        setStep(2);
      }
    }
  };

  // Gallery File Upload
  const handleGalleryFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setRawImage(reader.result as string);
      setCropBox({ x: 0.05, y: 0.08, w: 0.9, h: 0.82 });
      setRotation(0);
      stopCamera();
      setStep(2);
    };
    reader.readAsDataURL(f);
  };

  // Apply Crop & Rotation to Canvas -> produce final cropped image
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

      // Handle rotation transformations
      const rotCanvas = document.createElement('canvas');
      const rotCtx = rotCanvas.getContext('2d');
      if (!rotCtx) {
        setCroppedImage(rawImage);
        setStep(3);
        return;
      }

      if (rotation === 90 || rotation === 270) {
        rotCanvas.width = srcH;
        rotCanvas.height = srcW;
      } else {
        rotCanvas.width = srcW;
        rotCanvas.height = srcH;
      }

      rotCtx.translate(rotCanvas.width / 2, rotCanvas.height / 2);
      rotCtx.rotate((rotation * Math.PI) / 180);
      rotCtx.drawImage(img, -srcW / 2, -srcH / 2);

      // Crop coordinates based on cropBox percentage
      const cropX = rotCanvas.width * cropBox.x;
      const cropY = rotCanvas.height * cropBox.y;
      const cropW = Math.max(rotCanvas.width * cropBox.w, 40);
      const cropH = Math.max(rotCanvas.height * cropBox.h, 40);

      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = cropW;
      finalCanvas.height = cropH;
      const finalCtx = finalCanvas.getContext('2d');

      if (finalCtx) {
        finalCtx.drawImage(
          rotCanvas,
          cropX, cropY, cropW, cropH,
          0, 0, cropW, cropH
        );
        const croppedUrl = finalCanvas.toDataURL('image/jpeg', 0.92);
        setCroppedImage(croppedUrl);
      } else {
        setCroppedImage(rawImage);
      }
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
        
        {/* STEP 1: 1:1 RATIO LIVE SCANNER WITH LASER SCANNING BEAM */}
        {step === 1 && (
          <div className="relative w-full h-full flex flex-col justify-between p-4 bg-black">
            
            {/* Top Bar: Close Button & Flashlight */}
            <div className="relative z-30 flex items-center justify-between pt-2 px-2">
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors border border-white/10"
                title="Close Scanner"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Live Auto-Detector Status Badge */}
              <div className={`px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg border transition-all ${
                detectedBox.isDetected
                  ? 'bg-emerald-950/80 border-emerald-400/60 text-emerald-300'
                  : 'bg-[#3a3520]/80 border-amber-400/40 text-amber-300'
              }`}>
                <p className="font-bold text-xs flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${detectedBox.isDetected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
                  {detectedBox.isDetected ? '✓ Document / Question Auto-Detected' : 'Hold camera still — Auto-detecting...'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFlashlight}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border border-white/10 ${
                    flashlightOn ? 'bg-amber-400 text-black' : 'bg-black/60 backdrop-blur-md text-white'
                  }`}
                >
                  <Zap className="w-5 h-5 fill-current" />
                </button>
              </div>
            </div>

            {/* 1:1 Ratio Square Viewfinder Frame with Animated Laser Scan Beam */}
            <div className="relative flex-1 my-3 flex items-center justify-center overflow-hidden">
              <div className="relative w-full max-w-xs aspect-square rounded-3xl overflow-hidden bg-black flex items-center justify-center border-2 border-cyan-400/40 shadow-[0_0_40px_rgba(0,240,255,0.25)]">
                
                {/* Live Camera Feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Animated Futuristic Laser Scan Line */}
                <div
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#00f0ff] z-20 pointer-events-none"
                  style={{ animation: 'scanLaserBeam 2.4s ease-in-out infinite' }}
                />

                {!hasCamera && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#101424] text-white/60 space-y-3">
                    <Camera className="w-12 h-12 text-cyan-400 animate-pulse" />
                    <p className="text-xs font-semibold text-white">Align question inside 1:1 frame</p>
                    <p className="text-[11px] text-white/50">Real-time auto-detector active</p>
                  </div>
                )}

                {/* Corner Target Reticles */}
                <div className="absolute inset-4 pointer-events-none z-30 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-7 h-7 border-t-3 border-l-3 border-cyan-400 rounded-tl-xl shadow-[0_0_12px_#00f0ff]" />
                  <div className="absolute top-0 right-0 w-7 h-7 border-t-3 border-r-3 border-cyan-400 rounded-tr-xl shadow-[0_0_12px_#00f0ff]" />
                  <div className="absolute bottom-0 right-0 w-7 h-7 border-b-3 border-r-3 border-cyan-400 rounded-br-xl shadow-[0_0_12px_#00f0ff]" />
                  <div className="absolute bottom-0 left-0 w-7 h-7 border-b-3 border-l-3 border-cyan-400 rounded-bl-xl shadow-[0_0_12px_#00f0ff]" />
                </div>
              </div>
            </div>

            {/* Bottom Shutter Capture + Upload Button */}
            <div className="relative z-30 flex flex-col items-center gap-4 pb-4">
              <button
                onClick={captureFrameToCrop}
                className="w-16 h-16 rounded-full bg-white p-1 shadow-2xl flex items-center justify-center active:scale-90 transition-transform"
                title="Capture Frame"
              >
                <div className="w-full h-full rounded-full border-2 border-black/20 bg-white" />
              </button>

              <button
                onClick={() => galleryRef.current?.click()}
                className="px-6 py-3 rounded-full bg-white text-black font-semibold text-xs shadow-xl flex items-center gap-2 hover:bg-gray-100 active:scale-95 transition-all"
              >
                <ImageIcon className="w-4 h-4 text-black" />
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
                  onClick={() => setRotation((prev) => (prev + 270) % 360)}
                  className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-amber-400 hover:bg-white/20 transition-colors"
                  title="Rotate Left"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
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
                onClick={() => setCropBox({ x: 0.03, y: 0.03, w: 0.94, h: 0.94 })}
                className="px-3 py-1 rounded-lg bg-white/10 text-[11px] font-semibold text-white/80 hover:bg-amber-400 hover:text-black transition-colors"
              >
                Full Image
              </button>
              <button
                type="button"
                onClick={() => setCropBox({ x: 0.08, y: 0.15, w: 0.84, h: 0.55 })}
                className="px-3 py-1 rounded-lg bg-white/10 text-[11px] font-semibold text-white/80 hover:bg-amber-400 hover:text-black transition-colors"
              >
                Question Box
              </button>
              <button
                type="button"
                onClick={() => setCropBox({ x: 0.08, y: 0.25, w: 0.84, h: 0.30 })}
                className="px-3 py-1 rounded-lg bg-white/10 text-[11px] font-semibold text-white/80 hover:bg-amber-400 hover:text-black transition-colors"
              >
                Formula Strip
              </button>
            </div>

            {/* Interactive Image Container with Drag-to-Move and Corner Handles */}
            <div className="relative flex-1 my-2 flex items-center justify-center overflow-hidden">
              {rawImage && (
                <div
                  className="relative max-w-md w-full max-h-[60vh] flex items-center justify-center rounded-2xl overflow-hidden bg-[#0a0d1a] p-2 border border-white/15 select-none touch-none shadow-2xl"
                  onPointerMove={(e) => {
                    if (!draggingHandle) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                    const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

                    setCropBox(prev => {
                      let { x, y, w, h } = prev;
                      if (draggingHandle === 'move' && dragStart) {
                        const dx = relX - dragStart.relX;
                        const dy = relY - dragStart.relY;
                        const newX = Math.max(0.01, Math.min(0.99 - w, dragStart.boxX + dx));
                        const newY = Math.max(0.01, Math.min(0.99 - h, dragStart.boxY + dy));
                        return { ...prev, x: newX, y: newY };
                      }
                      if (draggingHandle === 'tl') {
                        const newW = (x + w) - relX;
                        const newH = (y + h) - relY;
                        if (newW > 0.08 && newH > 0.08) { x = relX; y = relY; w = newW; h = newH; }
                      } else if (draggingHandle === 'tr') {
                        const newW = relX - x;
                        const newH = (y + h) - relY;
                        if (newW > 0.08 && newH > 0.08) { y = relY; w = newW; h = newH; }
                      } else if (draggingHandle === 'br') {
                        const newW = relX - x;
                        const newH = relY - y;
                        if (newW > 0.08 && newH > 0.08) { w = newW; h = newH; }
                      } else if (draggingHandle === 'bl') {
                        const newW = (x + w) - relX;
                        const newH = relY - y;
                        if (newW > 0.08 && newH > 0.08) { x = relX; w = newW; h = newH; }
                      } else if (draggingHandle === 'top') {
                        const newH = (y + h) - relY;
                        if (newH > 0.08) { y = relY; h = newH; }
                      } else if (draggingHandle === 'bottom') {
                        const newH = relY - y;
                        if (newH > 0.08) { h = newH; }
                      } else if (draggingHandle === 'left') {
                        const newW = (x + w) - relX;
                        if (newW > 0.08) { x = relX; w = newW; }
                      } else if (draggingHandle === 'right') {
                        const newW = relX - x;
                        if (newW > 0.08) { w = newW; }
                      }
                      return { x, y, w, h };
                    });
                  }}
                  onPointerUp={() => {
                    setDraggingHandle(null);
                    setDragStart(null);
                  }}
                  onPointerLeave={() => {
                    setDraggingHandle(null);
                    setDragStart(null);
                  }}
                >
                  <img
                    src={rawImage}
                    alt="Captured for crop"
                    style={{ transform: `rotate(${rotation}deg)` }}
                    className="max-h-[55vh] max-w-full object-contain rounded-xl pointer-events-none transition-transform duration-200"
                  />

                  {/* Interactive Crop Boundary Box */}
                  <div
                    className="absolute border-2 border-amber-400 rounded-xl shadow-[0_0_30px_rgba(251,191,36,0.6)] pointer-events-auto cursor-move"
                    style={{
                      top: `${cropBox.y * 100}%`,
                      left: `${cropBox.x * 100}%`,
                      width: `${cropBox.w * 100}%`,
                      height: `${cropBox.h * 100}%`
                    }}
                  >
                    {/* Draggable Center Move Body */}
                    <div
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
                        if (rect) {
                          const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                          const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
                          setDragStart({ relX, relY, boxX: cropBox.x, boxY: cropBox.y });
                        }
                        setDraggingHandle('move');
                      }}
                      className="absolute inset-0 z-10 cursor-move"
                    />

                    {/* Grid Rule-of-Thirds Lines */}
                    <div className="absolute inset-0 pointer-events-none opacity-30 grid grid-cols-3 grid-rows-3">
                      <div className="border-r border-amber-300" />
                      <div className="border-r border-amber-300" />
                      <div />
                      <div className="border-t border-r border-amber-300" />
                      <div className="border-t border-r border-amber-300" />
                      <div className="border-t border-amber-300" />
                      <div className="border-t border-r border-amber-300" />
                      <div className="border-t border-r border-amber-300" />
                      <div className="border-t border-amber-300" />
                    </div>

                    {/* 4 Interactive Corner Drag Handles */}
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); setDraggingHandle('tl'); }}
                      className="absolute -top-3.5 -left-3.5 w-7 h-7 rounded-full bg-amber-400 border-2 border-white shadow-2xl cursor-nwse-resize touch-none flex items-center justify-center active:scale-125 transition-transform z-20"
                    />
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); setDraggingHandle('tr'); }}
                      className="absolute -top-3.5 -right-3.5 w-7 h-7 rounded-full bg-amber-400 border-2 border-white shadow-2xl cursor-nesw-resize touch-none flex items-center justify-center active:scale-125 transition-transform z-20"
                    />
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); setDraggingHandle('br'); }}
                      className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-amber-400 border-2 border-white shadow-2xl cursor-nwse-resize touch-none flex items-center justify-center active:scale-125 transition-transform z-20"
                    />
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); setDraggingHandle('bl'); }}
                      className="absolute -bottom-3.5 -left-3.5 w-7 h-7 rounded-full bg-amber-400 border-2 border-white shadow-2xl cursor-nesw-resize touch-none flex items-center justify-center active:scale-125 transition-transform z-20"
                    />

                    {/* 4 Edge Handles */}
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); setDraggingHandle('top'); }}
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 rounded-full bg-amber-400 border border-white cursor-ns-resize touch-none z-20"
                    />
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); setDraggingHandle('bottom'); }}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-3 rounded-full bg-amber-400 border border-white cursor-ns-resize touch-none z-20"
                    />
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); setDraggingHandle('left'); }}
                      className="absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-8 rounded-full bg-amber-400 border border-white cursor-ew-resize touch-none z-20"
                    />
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); setDraggingHandle('right'); }}
                      className="absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-8 rounded-full bg-amber-400 border border-white cursor-ew-resize touch-none z-20"
                    />
                  </div>
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
