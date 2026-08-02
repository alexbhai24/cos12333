import React, { useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QrModal: React.FC = () => {
  const { isQrModalOpen, setIsQrModalOpen } = useApp();

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isQrModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isQrModalOpen]);

  if (!isQrModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0 z-0 cursor-pointer" onClick={() => setIsQrModalOpen(false)} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-[#0A0D22] border border-[rgba(55,217,150,0.3)] rounded-[32px] shadow-2xl overflow-hidden p-6 md:p-8 animate-in zoom-in-95 duration-200 text-center">
        {/* Close Button */}
        <button
          onClick={() => setIsQrModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <h3 className="text-lg font-bold text-white font-heading mt-2">GPay UPI Payment</h3>
        <p className="text-xs text-gray-400 mt-1 mb-6 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#37D996]" /> Secured Peer-to-Peer Transfer
        </p>

        {/* QR Code Container */}
        <div className="bg-white rounded-2xl p-5 shadow-inner max-w-[340px] mx-auto overflow-hidden border border-white/10 flex items-center justify-center">
          <img 
            src="/donation_qr.jpg" 
            alt="UPI Donation QR Code" 
            className="w-full h-auto object-contain block select-none select-all-none rounded-xl"
            style={{ imageRendering: 'crisp-edges', WebkitPrintColorAdjust: 'exact' }}
            onDragStart={(e) => e.preventDefault()}
          />
        </div>

        {/* UPI Details */}
        <div className="mt-6 bg-[#040614] rounded-xl p-3.5 border border-white/5 text-xs space-y-1 max-w-[340px] mx-auto">
          <div className="text-gray-400">UPI ID:</div>
          <div className="font-mono font-bold text-white tracking-wider select-all text-sm">rajanandalex1@okaxis</div>
        </div>

        {/* Footer Instruction */}
        <p className="text-xs text-gray-400 mt-6 leading-relaxed max-w-[340px] mx-auto">
          Open your UPI app (GPay, PhonePe, Paytm, etc.) and scan this QR code to donate or purchase Apples.
        </p>
      </div>
    </div>
  );
};
