import React, { useState } from 'react';
import { X, Cloud, Key, Copy, Check, ShieldCheck, LogIn, UserPlus, HelpCircle, Server } from 'lucide-react';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  SUPABASE_SCHEMA_SQL,
  getSupabase,
} from '../../utils/supabaseClient';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'auth' | 'supabase' | 'vercel'>('auth');
  const [email, setEmail] = useState<string>(userProfile.email || '');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>(userProfile.displayName || 'Conscious Seeker');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authMessage, setAuthMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Supabase Config state
  const existingCreds = getSupabaseCredentials();
  const [sbUrl, setSbUrl] = useState<string>(existingCreds.url);
  const [sbKey, setSbKey] = useState<string>(existingCreds.key);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [configSuccess, setConfigSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseCredentials(sbUrl, sbKey);
    setConfigSuccess(true);
    setTimeout(() => setConfigSuccess(false), 3000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthMessage('');

    const supabase = getSupabase();
    if (supabase) {
      try {
        if (authMode === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { display_name: displayName } },
          });
          if (error) throw error;
          setAuthMessage('Account created successfully! Check your email to confirm if required.');
          if (data.user) {
            onUpdateProfile({
              ...userProfile,
              id: data.user.id,
              email: data.user.email || email,
              displayName,
            });
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          setAuthMessage('Signed in successfully!');
          if (data.user) {
            onUpdateProfile({
              ...userProfile,
              id: data.user.id,
              email: data.user.email || email,
              displayName: data.user.user_metadata?.display_name || displayName,
            });
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Authentication failed';
        setAuthMessage(`Supabase Auth Note: ${msg}`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Offline Local Mode Authentication
      setTimeout(() => {
        setIsSubmitting(false);
        onUpdateProfile({
          ...userProfile,
          email,
          displayName,
        });
        setAuthMessage(`Logged in locally as ${displayName}. (Data saved to your device).`);
      }, 400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-900/10 max-h-[92vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between gap-4 bg-emerald-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-teal-300">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 id="auth-modal-title" className="text-lg sm:text-xl font-bold font-heading">
                Account &amp; Supabase Cloud Setup
              </h3>
              <p className="text-xs text-stone-300">
                Ready for deployment on Vercel with persistent Supabase database
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Account Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-3 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('auth')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'auth'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign In / Sign Up
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'supabase'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Supabase Credentials
          </button>
          <button
            onClick={() => setActiveTab('vercel')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'vercel'
                ? 'border-emerald-700 text-emerald-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Vercel Deployment &amp; SQL Schema
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: User Login / Sign Up */}
          {activeTab === 'auth' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-stone-100 p-1 rounded-xl w-fit text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    authMode === 'signin' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Existing User Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    authMode === 'signup' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  Create New Account
                </button>
              </div>

              {authMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
                  {authMessage}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Sivakumar"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-emerald-600"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seeker@morningmiracles.app"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {authMode === 'signin' ? (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>{isSubmitting ? 'Signing in...' : 'Sign In to Miracle Mornings'}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
                    </>
                  )}
                </button>
              </form>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
                <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Local Guest Mode Always Active
                </div>
                <p>
                  Even without cloud accounts, your daily 10 blessings, 7 sips counter, and streak history
                  are safely stored in your browser&apos;s local storage.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Supabase Credentials */}
          {activeTab === 'supabase' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-stone-900 font-heading">
                  Connect Your Supabase Project
                </h4>
                <p className="text-xs text-stone-500">
                  Enter your Project URL and Public Anon Key from your Supabase dashboard (Project Settings &gt; API).
                </p>
              </div>

              {configSuccess && (
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-700" />
                  Supabase settings saved and active!
                </div>
              )}

              <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    value={sbUrl}
                    onChange={(e) => setSbUrl(e.target.value)}
                    placeholder="https://xyzproject.supabase.co"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Supabase Anon / Public API Key
                  </label>
                  <input
                    type="text"
                    value={sbKey}
                    onChange={(e) => setSbKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-emerald-600 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    Save Supabase Keys
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: Vercel & SQL Migration Guide */}
          {activeTab === 'vercel' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-stone-900 font-heading">
                  Vercel Deployment &amp; Database Migration
                </h4>
                <p className="text-xs text-stone-500">
                  Follow these 3 easy steps to deploy Miracle Mornings on Vercel with your Supabase database:
                </p>
              </div>

              {/* Step 1: SQL Schema */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Step 1: Run SQL Migration in Supabase
                  </span>
                  <button
                    onClick={handleCopySql}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium cursor-pointer shadow-xs"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied SQL!' : 'Copy Schema SQL'}</span>
                  </button>
                </div>
                <p className="text-xs text-stone-600">
                  Paste this script into the <strong>SQL Editor</strong> in your Supabase dashboard to create
                  the tables for profiles, daily streaks, 10 blessings, and journal records with Row Level Security.
                </p>
                <pre className="text-[11px] p-2.5 bg-stone-900 text-emerald-300 rounded-xl overflow-x-auto max-h-28 font-mono">
                  {SUPABASE_SCHEMA_SQL}
                </pre>
              </div>

              {/* Step 2 & 3 */}
              <div className="space-y-3 text-xs text-stone-700">
                <div className="p-3.5 rounded-2xl border border-stone-200 bg-white">
                  <strong>Step 2: Deploy to Vercel</strong>
                  <p className="text-stone-500 mt-0.5">
                    Import this repository into Vercel. Framework preset will automatically detect <strong>Vite</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-stone-200 bg-white">
                  <strong>Step 3: Set Vercel Environment Variables</strong>
                  <p className="text-stone-500 mt-0.5">
                    In Vercel Project Settings &gt; Environment Variables, add:
                  </p>
                  <ul className="mt-1 font-mono text-[11px] text-emerald-800 space-y-0.5">
                    <li>• VITE_SUPABASE_URL = your_supabase_project_url</li>
                    <li>• VITE_SUPABASE_ANON_KEY = your_supabase_anon_key</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
