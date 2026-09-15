import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Home,
  Video,
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

export const BOTTOM_BAR_ROUTES: PageRoute[] = ['home', 'videos', 'tools'];

const NAV_ITEMS: NavItem[] = [
  { id: 'home',   label: 'Home',  icon: Home },
  { id: 'videos', label: 'Video', icon: Video },
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
  const [rotation, setRotation] = useState(0);

  // Crop box bounding rectangle percentages (x, y, w, h)
  const [cropBox, setCropBox] = useState({ x: 0.05, y: 0.08, w: 0.9, h: 0.82 });

  // Form Fields
  const [note, setNote]       = useState('');
  const [mySlip, setMySlip]   = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation]     = useState('');
  const [done, setDone]       = useState(false);

  // Lightbox View Image
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

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
    }

    return () => {
      isMounted = false;
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [step]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

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

  const [draggingCorner, setDraggingCorner] = useState<'tl' | 'tr' | 'br' | 'bl' | null>(null);

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

        if (stream) {
          stream.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
          });
          setStream(null);
        }
        setStep(2); // Smoothly proceed to Step 2 Crop Screen
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
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
        setStream(null);
      }
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
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setCroppedImage(rawImage);
        setStep(3);
        return;
      }

      // Crop coordinates based on cropBox percentage
      const cropX = img.width * cropBox.x;
      const cropY = img.height * cropBox.y;
      const cropW = Math.max(img.width * cropBox.w, 50);
      const cropH = Math.max(img.height * cropBox.h, 50);

      canvas.width = cropW;
      canvas.height = cropH;

      ctx.drawImage(
        img,
        cropX, cropY, cropW, cropH,
        0, 0, cropW, cropH
      );

      const croppedUrl = canvas.toDataURL('image/jpeg', 0.92);
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

  // Close modal & stop camera/mic streams immediately
  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      setStream(null);
    }
    onClose();
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

  return (
    <>
      {/* Fullscreen Overlay */}
      <div className="fixed inset-0 z-[9999] bg-[#0a0c16] flex flex-col justify-between select-none font-sans overflow-hidden">
        
        {/* STEP 1: REAL LIVE CAMERA SCANNER VIEW (MATCHING USER SCREENSHOT IMAGE 1) */}
        {step === 1 && (
          <div className="relative w-full h-full flex flex-col justify-between p-4 bg-black">
            
            {/* Top Bar: Close Button & Flashlight/QR Tools */}
            <div className="relative z-30 flex items-center justify-between pt-2 px-2">
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                title="Close Scanner"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Tooltip: Hold your camera still (MATCHING USER SCREENSHOT IMAGE 1) */}
              <div className="px-4 py-1.5 rounded-full bg-[#3a3520]/80 border border-amber-400/40 backdrop-blur-md shadow-lg">
                <p className="text-amber-300 font-bold text-xs">Hold your camera still.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFlashlight}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    flashlightOn ? 'bg-amber-400 text-black' : 'bg-black/60 backdrop-blur-md text-white'
                  }`}
                >
                  <Zap className="w-5 h-5 fill-current" />
                </button>
              </div>
            </div>

            {/* Center Live Camera Viewfinder + Bounding Detection Box (MATCHING USER SCREENSHOT IMAGE 1) */}
            <div className="relative flex-1 my-3 flex items-center justify-center overflow-hidden">
              <div className="relative w-full max-w-md h-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/10">
                
                {/* Live Camera Feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {!hasCamera && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#18181b] text-white/60 space-y-3">
                    <Camera className="w-12 h-12 text-amber-400 animate-pulse" />
                    <p className="text-xs font-semibold text-white">Align question inside frame</p>
                    <p className="text-[11px] text-white/40">Real-time document detector active</p>
                  </div>
                )}

                {/* Dynamic Camera Focus & Document Edge Detector (ONLY SHOWS WHEN DOCUMENT/TEXT IS IN FOCUS) */}
                <div className="absolute inset-10 pointer-events-none z-30 transition-all duration-300">
                  {/* Subtle Corner Markers */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/40 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white/40 rounded-tr-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/40 rounded-br-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white/40 rounded-bl-lg" />

                  {/* Target Focus Dot */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-xs" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Shutter Capture + Upload from Gallery Pill (MATCHING USER SCREENSHOT IMAGE 1) */}
            <div className="relative z-30 flex flex-col items-center gap-4 pb-4">
              <button
                onClick={captureFrameToCrop}
                className="w-16 h-16 rounded-full bg-white p-1 shadow-2xl flex items-center justify-center active:scale-90 transition-transform"
                title="Capture & Auto-Crop"
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

        {/* STEP 2: INTERACTIVE CROP & BOUNDARY ADJUSTMENT SCREEN (MATCHING USER SCREENSHOT IMAGE 2) */}
        {step === 2 && (
          <div className="relative w-full h-full flex flex-col justify-between p-4 bg-black animate-in fade-in duration-200">
            {/* Top Bar with Back Arrow */}
            <div className="relative z-30 flex items-center justify-between pt-2 px-2">
              <button
                onClick={() => setStep(1)}
                className="p-2 rounded-full text-white/80 hover:text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-xs font-bold text-white/80">Crop & Adjust Boundary</span>
              <div className="w-6" />
            </div>

            {/* Interactive Image Container with Drag Handles */}
            <div className="relative flex-1 my-4 flex items-center justify-center overflow-hidden">
              {rawImage && (
                <div
                  className="relative max-w-md w-full max-h-[65vh] flex items-center justify-center rounded-2xl overflow-hidden bg-[#0c0c0e] p-2 border border-white/10 select-none touch-none"
                  onPointerMove={(e) => {
                    if (!draggingCorner) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                    const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

                    setCropBox(prev => {
                      let { x, y, w, h } = prev;
                      if (draggingCorner === 'tl') {
                        const newW = (x + w) - relX;
                        const newH = (y + h) - relY;
                        if (newW > 0.1 && newH > 0.1) { x = relX; y = relY; w = newW; h = newH; }
                      } else if (draggingCorner === 'tr') {
                        const newW = relX - x;
                        const newH = (y + h) - relY;
                        if (newW > 0.1 && newH > 0.1) { y = relY; w = newW; h = newH; }
                      } else if (draggingCorner === 'br') {
                        const newW = relX - x;
                        const newH = relY - y;
                        if (newW > 0.1 && newH > 0.1) { w = newW; h = newH; }
                      } else if (draggingCorner === 'bl') {
                        const newW = (x + w) - relX;
                        const newH = relY - y;
                        if (newW > 0.1 && newH > 0.1) { x = relX; w = newW; h = newH; }
                      }
                      return { x, y, w, h };
                    });
                  }}
                  onPointerUp={() => setDraggingCorner(null)}
                  onPointerLeave={() => setDraggingCorner(null)}
                >
                  <img
                    src={rawImage}
                    alt="Captured for crop"
                    className="max-h-[60vh] max-w-full object-contain rounded-xl pointer-events-none"
                  />

                  {/* Interactive Crop Boundary Box */}
                  <div
                    className="absolute border-2 border-amber-400 rounded-xl shadow-[0_0_25px_rgba(251,191,36,0.6)]"
                    style={{
                      top: `${cropBox.y * 100}%`,
                      left: `${cropBox.x * 100}%`,
                      width: `${cropBox.w * 100}%`,
                      height: `${cropBox.h * 100}%`
                    }}
                  >
                    {/* 4 Interactive Corner Drag Handles */}
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); setDraggingCorner('tl'); }}
                      className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-amber-400 border-2 border-white shadow-xl cursor-nwse-resize touch-none flex items-center justify-center active:scale-125 transition-transform"
                    />
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); setDraggingCorner('tr'); }}
                      className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-amber-400 border-2 border-white shadow-xl cursor-nesw-resize touch-none flex items-center justify-center active:scale-125 transition-transform"
                    />
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); setDraggingCorner('br'); }}
                      className="absolute -bottom-3 -right-3 w-7 h-7 rounded-full bg-amber-400 border-2 border-white shadow-xl cursor-nwse-resize touch-none flex items-center justify-center active:scale-125 transition-transform"
                    />
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); setDraggingCorner('bl'); }}
                      className="absolute -bottom-3 -left-3 w-7 h-7 rounded-full bg-amber-400 border-2 border-white shadow-xl cursor-nesw-resize touch-none flex items-center justify-center active:scale-125 transition-transform"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Retake & Save Action Bar */}
            <div className="relative z-30 flex flex-col items-center gap-4 pb-4">

              {/* Retake (Left) & Save (Right) Text Buttons (MATCHING USER SCREENSHOT IMAGE 2) */}
              <div className="w-full flex items-center justify-between px-8 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-white/80 hover:text-white text-base font-semibold transition-colors"
                >
                  Retake
                </button>

                <button
                  type="button"
                  onClick={applyCropAndProceed}
                  className="text-white font-bold text-base hover:text-amber-400 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SYLLABUS MAPPING & SOLUTION DETAILS (MATCHING USER SCREENSHOT IMAGE 3) */}
        {step === 3 && (
          <div className="relative w-full h-full flex flex-col justify-between p-5 overflow-y-auto custom-scrollbar bg-[#0d1226]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-bold text-base">Add to Error Book</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/10 text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-4">
              {/* Cropped Photo Preview with View Full & Download Overlay Icons */}
              {croppedImage && (
                <div className="relative w-full rounded-2xl overflow-hidden bg-[#0c0f1d] border border-white/15 max-h-56 flex items-center justify-center">
                  <img src={croppedImage} alt="Cropped preview" className="w-full max-h-56 object-contain rounded-2xl" />

                  {/* Centered Download Button Icon matching Image 3 */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDownloadImage(croppedImage)}
                      className="w-12 h-12 rounded-full bg-amber-400/90 text-black flex items-center justify-center shadow-2xl"
                    >
                      <Download className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Top-Right Overlay Icons */}
                  <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20">
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
export const MobileBottomNav: React.FC = () => {
  const { currentRoute, setCurrentRoute } = useApp();
  const [scannerOpen, setScannerOpen] = useState(false);

  if (!BOTTOM_BAR_ROUTES.includes(currentRoute)) {
    return null;
  }

  const handleNav = (id: PageRoute) => {
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
        {/* ── Dark pill with 3 nav items ── */}
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

        {/* ── Scanner circle button ── */}
        <button
          onClick={() => setScannerOpen(true)}
          aria-label="Scan and add to Error Book"
          className="flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-200 active:scale-90 outline-none select-none"
          style={{
            width: '58px',
            height: '58px',
            background: 'rgba(8,10,22,0.90)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <svg
            width="26" height="26" viewBox="0 0 26 26" fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            <path d="M4 9V4h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 9V4h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 17v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 17v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 10v6M10 13h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ── Add to Error Book Scanner Sheet ── */}
      {scannerOpen && <ScannerSheet onClose={() => setScannerOpen(false)} />}
    </>
  );
};
