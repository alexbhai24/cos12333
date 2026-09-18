import React from 'react';
import { MailCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const VerificationPage: React.FC = () => {
  const { pendingVerificationEmail, clearPendingVerification } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background: identical to AuthPage */}
      <div className="absolute inset-0 bg-[#040812]" />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-cyan-600/10 rounded-full filter blur-[150px]" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-violet-600/10 rounded-full filter blur-[150px]" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right,#2DD4E8 1px,transparent 1px),linear-gradient(to bottom,#2DD4E8 1px,transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl border border-white/20 mb-4">
            <img src="/logo.png" alt="CosmicBone Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-handwritten text-4xl text-white tracking-wide drop-shadow">
            Cosmic<span className="text-[#00F0FF]">Bone</span>
          </span>
          <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-1">
            NEXT-GEN EDTECH
          </span>
        </div>

        {/* Verification card */}
        <div className="bg-[#090C22]/90 border border-[rgba(0,240,255,0.18)] rounded-2xl shadow-2xl p-8 backdrop-blur-md text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00F0FF]/20 to-[#58A6FF]/20 border border-[rgba(0,240,255,0.3)] flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <MailCheck className="w-9 h-9 text-[#00F0FF]" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-3 tracking-tight">
            Verify your email
          </h2>

          {/* The exact message the user requested */}
          <p className="text-sm text-gray-400 leading-relaxed mb-2">
            We have sent you a verification email to
          </p>
          <p className="text-sm font-semibold text-[#00F0FF] mb-6 break-all px-2">
            {pendingVerificationEmail}
          </p>
          <p className="text-sm text-gray-400 leading-relaxed mb-8">
            Please verify it and log in.
          </p>

          {/* Steps */}
          <ol className="text-left space-y-2.5 mb-8 bg-[#060919] border border-[rgba(0,240,255,0.1)] rounded-xl px-5 py-4">
            {[
              'Open the email we just sent you',
              'Click the verification link inside',
              'Come back here and sign in',
            ].map((step, i) => (
              <li key={i} className="flex items-start space-x-3 text-xs text-gray-400">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00F0FF]/15 border border-[rgba(0,240,255,0.3)] text-[#00F0FF] text-[10px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          {/* Login button */}
          <button
            onClick={clearPendingVerification}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#00C4CC] to-[#58A6FF] hover:from-[#00D4E0] hover:to-[#70B8FF] transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 group"
          >
            <span>Login</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <p className="text-[11px] text-gray-600 mt-4">
            Didn't receive the email? Check your spam folder.
          </p>
        </div>

        <p className="text-center text-[10px] text-gray-600 mt-6 tracking-wider">
          COSMICBONE — NEXT-GEN EDTECH PLATFORM
        </p>
      </div>
    </div>
  );
};
