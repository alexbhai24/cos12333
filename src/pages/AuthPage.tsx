import React, { useState } from 'react';
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // User closed the popup — not an error
      } else {
        setError('Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#040812]">
      {/* Ambient backgrounds & glows */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-cyan-600/10 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-violet-600/10 rounded-full filter blur-[150px] pointer-events-none" />
      
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #2DD4E8 1px, transparent 1px), linear-gradient(to bottom, #2DD4E8 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 w-full max-w-md text-center space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* Branding/Logo */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border border-white/20 mb-5 bg-[#090C22]/80 flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/20 to-[#8B5CF6]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img src="/logo.png" alt="CosmicBone Logo" className="w-16 h-16 object-cover relative z-10" />
          </div>
          <h1 className="font-handwritten text-5xl text-white tracking-wide drop-shadow-md">
            Cosmic<span className="text-[#00F0FF]">Bone</span>
          </h1>
          <p className="text-xs font-bold text-gray-500 tracking-widest uppercase mt-2">
            NEXT-GEN EDTECH PLATFORM
          </p>
        </div>

        {/* Action Card */}
        <div className="bg-[#090C22]/85 border border-[rgba(0,240,255,0.18)] rounded-3xl shadow-2xl p-8 backdrop-blur-xl relative overflow-hidden group">
          {/* Subtle top border highlight */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F0FF]/40 to-transparent" />
          
          <h2 className="text-xl font-semibold text-white mb-2">Welcome Explorer</h2>
          <p className="text-xs text-gray-400 mb-8 leading-relaxed max-w-xs mx-auto">
            Ready to master Quantum Sciences, Neural AI, and Deep Space Tech? Sign in to begin.
          </p>

          {/* Error Message */}
          {error && (
            <div className="flex items-start space-x-2 bg-red-950/20 border border-red-500/30 rounded-xl px-4 py-3 text-left mb-6 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-red-400">{error}</span>
            </div>
          )}

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3.5 py-4 px-6 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm font-semibold text-white group/btn hover:shadow-[0_0_25px_rgba(0,240,255,0.15)]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[var(--color-cyan)]" />
                <span className="text-gray-300">Opening secure sign-in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 flex-shrink-0 transition-transform group-hover/btn:scale-110" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span className="tracking-wide">Get Started with Google</span>
                <ArrowRight className="w-4 h-4 text-[#00F0FF] opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
              </>
            )}
          </button>
        </div>

        <p className="text-[10px] text-gray-600 tracking-wider">
          © 2026 COSMICBONE EDTECH INC. ALL RIGHTS RESERVED
        </p>
      </div>
    </div>
  );
};
