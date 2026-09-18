import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { User, Check, Sparkles, Upload, Link2, LogOut, X, Lock } from 'lucide-react';
import { auth } from '../../firebase';
import { AvatarDecoration } from '../AvatarDecoration';
import { normalizeGrade } from '../../utils/gradeUtils';
import type { UserProfile } from '../../types';

const AVATAR_TEMPLATES = [
  { id: 'astronaut', label: 'Cosmic Voyager', gradient: 'from-[#00F0FF] to-[#8B5CF6]' },
  { id: 'cyberpunk', label: 'Neural Hacker', gradient: 'from-[#FF007A] to-[#7928CA]' },
  { id: 'nebula', label: 'Nebula Entity', gradient: 'from-[#FF4D4D] to-[#F9CB28]' },
  { id: 'solar', label: 'Solar Flare', gradient: 'from-[#10B981] to-[#059669]' },
];

export const ProfileSetupModal: React.FC = () => {
  const { user, updateUserProfile } = useApp();
  const { logout } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [gradeLevel, setGradeLevel] = useState<
    'class_6' | 'class_7' | 'class_8' | 'class_9' | 'class_10' | 'pcb' | 'pcm' | 'skill' | 'dropper' | ''
  >('');
  
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_TEMPLATES[0].id);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [decoration, setDecoration] = useState<UserProfile['decoration']>('none');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const emailLower = (user.email || '').toLowerCase().trim();
      const derivedUser = emailLower ? emailLower.split('@')[0].replace(/[^a-z0-9_]/g, '') : 'cosmic_user';
      
      const googleName = auth.currentUser?.displayName;
      const derivedFirst = googleName ? (googleName.split(' ')[0] || 'Cosmic') : (user.firstName || (user.name && user.name !== 'New Student' ? user.name.split(' ')[0] : (emailLower ? emailLower.split('@')[0].charAt(0).toUpperCase() + emailLower.split('@')[0].slice(1) : 'Cosmic')));
      const derivedLast = googleName ? (googleName.split(' ').slice(1).join(' ') || 'Voyager') : (user.lastName || (user.name && user.name.includes(' ') ? user.name.split(' ').slice(1).join(' ') : 'Voyager'));

      setFirstName(derivedFirst);
      setLastName(derivedLast);
      setUsername(user.username || derivedUser);
      setGender((user.gender === 'male' || user.gender === 'female') ? user.gender : 'male');
      setGradeLevel((normalizeGrade(user.gradeLevel) as any) || 'pcb');
    }
  }, [user]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/gif')) {
      setError('Please upload a valid PNG, JPG, or GIF file');
      return;
    }

    if (file.size > 1.5 * 1024 * 1024) {
      setError('File size must be less than 1.5MB');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const cycleDecoration = () => {
    const decos: UserProfile['decoration'][] = ['none', 'orbit', 'energy', 'rings', 'flame', 'glitch', 'shield', 'supernova', 'web'];
    const currentIdx = decos.indexOf(decoration || 'none');
    const nextIdx = (currentIdx + 1) % decos.length;
    setDecoration(decos[nextIdx]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !username || !gender) {
      setError('Please fill in all mandatory fields');
      return;
    }

    if (!gradeLevel) {
      setError('Please select your class / academic level');
      return;
    }

    const finalPhotoUrl = customPhotoUrl || `gradient:${selectedAvatar}`;

    updateUserProfile({
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      username,
      gender: gender as 'male' | 'female',
      userType: 'student',
      gradeLevel: gradeLevel as any,
      photoUrl: finalPhotoUrl,
      decoration,
      setupComplete: true,
    });
  };

  const getGradientClass = (avatarId: string) => {
    return AVATAR_TEMPLATES.find((a) => a.id === avatarId)?.gradient || 'from-[#00F0FF] to-[#8B5CF6]';
  };

  return (
    <div className="modal-backdrop" style={{ alignItems: 'flex-start', overflowY: 'auto', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-cyan-600/10 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="modal-panel modal-panel-lg relative z-10" style={{ maxWidth: '42rem' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-[#00F0FF] animate-pulse" />
              <span>Setup Your Profile</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Welcome to CosmicBone. Customize your learning profile to begin.
            </p>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-red-950/20 border border-red-500/20 hover:bg-red-900/30 text-red-400 hover:text-red-300 text-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="modal-body">
        <form onSubmit={handleSave} className="space-y-6">
          {error && (
            <div className="p-3.5 bg-red-950/30 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Photo & Avatar Setup */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">
              1. Choose Profile Avatar
            </label>
            <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-[#060919]/60 border border-[rgba(0,240,255,0.08)] rounded-2xl">
              {/* Active Profile Circle (Clicking cycles decoration) */}
              <div 
                className="flex-shrink-0 flex items-center justify-center w-24 h-24 cursor-pointer"
                onClick={cycleDecoration}
                title="Click avatar to cycle animated effects!"
              >
                <AvatarDecoration decoration={decoration}>
                  {customPhotoUrl ? (
                    <img
                      src={customPhotoUrl}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border border-[#00F0FF] shadow-inner"
                    />
                  ) : (
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getGradientClass(selectedAvatar)} flex items-center justify-center border border-[#00F0FF] shadow-inner`}>
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}
                </AvatarDecoration>
              </div>

              {/* Template Picker / Custom URL */}
              <div className="flex-1 w-full space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AVATAR_TEMPLATES.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(avatar.id);
                        setCustomPhotoUrl('');
                      }}
                      className={`relative p-2 rounded-xl border text-center transition-all ${
                        selectedAvatar === avatar.id && !customPhotoUrl
                          ? 'border-[#00F0FF] bg-[#00F0FF]/10 text-white'
                          : 'border-transparent bg-white/5 hover:bg-white/10 text-gray-400'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatar.gradient} mx-auto mb-1 flex items-center justify-center`}>
                        {selectedAvatar === avatar.id && !customPhotoUrl && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-[10px] font-semibold block truncate">{avatar.label}</span>
                    </button>
                  ))}
                </div>

                {/* Custom Photo URL / Upload Option */}
                <div className="flex flex-col gap-2.5 w-full">
                  {/* Upload Button */}
                  <label className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-[rgba(0,240,255,0.2)] rounded-xl cursor-pointer transition-colors text-xs text-gray-200 font-semibold shadow-sm">
                    <Upload className="w-4 h-4 text-[#00F0FF]" />
                    <span>Upload Image or GIF</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/gif"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>

                  {/* URL Input Below Upload Button */}
                  <div className="relative w-full">
                    <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input
                      type="url"
                      value={customPhotoUrl && !customPhotoUrl.startsWith('data:') ? customPhotoUrl : ''}
                      onChange={(e) => setCustomPhotoUrl(e.target.value)}
                      placeholder="Or paste direct image URL (https://...)"
                      className="w-full bg-[#040612] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-xs rounded-xl pl-9 pr-4 py-2.5 placeholder-gray-600 text-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Decoration Selection */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">
              2. Choose Profile Effect (Discord-Style)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'none', label: 'None' },
                { id: 'energy', label: 'Energy Flow' },
                { id: 'rings', label: 'Cosmic Rings' },
                { id: 'orbit', label: 'Orbit Dots' },
                { id: 'flame', label: 'Solar Flame' },
                { id: 'glitch', label: 'Hologram Glitch' },
                { id: 'shield', label: 'Hyper Shield' },
                { id: 'supernova', label: 'Supernova' },
                { id: 'web', label: 'Quantum Web' },
              ].map((deco) => (
                <button
                  key={deco.id}
                  type="button"
                  onClick={() => setDecoration(deco.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    decoration === deco.id
                      ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-white'
                      : 'border-[rgba(0,240,255,0.08)] bg-white/5 hover:bg-white/10 text-gray-400'
                  }`}
                >
                  <div className="text-[10px] font-bold tracking-wide uppercase">{deco.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-sm rounded-xl px-4 py-3 placeholder-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-sm rounded-xl px-4 py-3 placeholder-gray-600 text-white"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-semibold">@</span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="username"
                className="w-full bg-[#060919] border border-[rgba(0,240,255,0.15)] focus:border-[#00F0FF] focus:outline-none text-sm rounded-xl pl-8 pr-4 py-3 placeholder-gray-600 text-white"
              />
            </div>
          </div>

          {/* Gender selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
              Gender
            </label>

            <div className="grid grid-cols-2 gap-3">
              {(['male', 'female'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-3 rounded-xl border text-sm font-semibold transition-all capitalize ${
                    gender === g
                      ? 'border-[#00F0FF] bg-[#00F0FF]/10 text-white shadow-lg shadow-cyan-500/5'
                      : 'border-[rgba(0,240,255,0.1)] bg-[#060919] hover:bg-white/5 text-gray-400'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Class selection */}
          <div className="animate-in fade-in slide-in-from-top-4 duration-200 space-y-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
              Select Academic Grade Level
            </label>

            {/* Middle School (6th, 7th, 8th) */}
            <div className="bg-[#040716] p-3 rounded-2xl border border-[rgba(0,240,255,0.1)]">
              <div className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>🏫 Middle School (Classes 6th, 7th & 8th)</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'class_6', label: '6th Class' },
                  { id: 'class_7', label: '7th Class' },
                  { id: 'class_8', label: '8th Class' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGradeLevel(item.id as any)}
                    className={`py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      gradeLevel === item.id
                        ? 'border-[#00F0FF] bg-[#00F0FF]/20 text-white shadow-[0_0_12px_rgba(0,240,255,0.3)] font-bold'
                        : 'border-[rgba(0,240,255,0.08)] bg-[#060919] hover:bg-white/5 text-gray-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* High School (9th & 10th) */}
            <div className="bg-[#040716] p-3 rounded-2xl border border-[rgba(0,240,255,0.1)]">
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>🏫 High School (Classes 9th & 10th)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'class_9', label: '9th Class' },
                  { id: 'class_10', label: '10th Class' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGradeLevel(item.id as any)}
                    className={`py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      gradeLevel === item.id
                        ? 'border-purple-400 bg-purple-500/20 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)] font-bold'
                        : 'border-[rgba(0,240,255,0.08)] bg-[#060919] hover:bg-white/5 text-gray-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Senior Secondary (PCB & PCM) */}
            <div className="bg-[#040716] p-3 rounded-2xl border border-[rgba(0,240,255,0.1)]">
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>🏫 Senior Secondary (PCB & PCM Streams)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'pcb', label: 'PCB (Physics, Chemistry, Bio)' },
                  { id: 'pcm', label: 'PCM (Physics, Chemistry, Math)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGradeLevel(item.id as any)}
                    className={`py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      gradeLevel === item.id
                        ? 'border-amber-400 bg-amber-500/20 text-white shadow-[0_0_12px_rgba(245,158,11,0.3)] font-bold'
                        : 'border-[rgba(0,240,255,0.08)] bg-[#060919] hover:bg-white/5 text-gray-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Specialization & Business */}
            <div className="bg-[#040716] p-3 rounded-2xl border border-[rgba(0,240,255,0.1)]">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>🎯 Specialization & Business Streams</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'skill', label: 'Skill Development' },
                  { id: 'dropper', label: 'Business Batch' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGradeLevel(item.id as any)}
                    className={`py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      gradeLevel === item.id
                        ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)] font-bold'
                        : 'border-[rgba(0,240,255,0.08)] bg-[#060919] hover:bg-white/5 text-gray-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#00C4CC] to-[#58A6FF] hover:from-[#00D4E0] hover:to-[#70B8FF] transition-all shadow-lg shadow-cyan-500/20 uppercase tracking-wider"
          >
            Launch Learning Journey 🚀
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};
