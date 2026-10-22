import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { Building2, School, ArrowRight, Lock, Mail, User, MapPin, Check } from 'lucide-react';

interface SignInScreenProps {
  onSignInSuccess: (user: {
    uid: string;
    email: string;
    displayName: string;
    role: 'buyer' | 'seller';
    entityId: string;
    customEntityName?: string;
    customAddress?: string;
    customCategory?: string;
  }) => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ onSignInSuccess }) => {
  // Step 1: 'auth' (create account or sign in)
  // Step 2: 'choose_role' (choose between buyer and seller)
  const [step, setStep] = useState<'auth' | 'choose_role'>('auth');
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');

  // Account credentials
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Authenticated user temp state before choosing role
  const [tempUser, setTempUser] = useState<{
    uid: string;
    email: string;
    displayName: string;
  } | null>(null);

  // Step 2 role choice state
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller'>('buyer');
  const [institutionName, setInstitutionName] = useState('');
  const [institutionType, setInstitutionType] = useState('Public High School');
  const [supplierName, setSupplierName] = useState('');
  const [supplierCategory, setSupplierCategory] = useState('Stationery & Books');
  const [organizationAddress, setOrganizationAddress] = useState('');

  // Handle email/password account creation or sign in
  const handleAuthSubmit = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    
    const emailEl = document.querySelector('input[type="email"]') as HTMLInputElement | null;
    const passEl = document.querySelector('input[type="password"]') as HTMLInputElement | null;
    const nameEl = document.querySelector('input[placeholder*="Sarah"]') as HTMLInputElement | null;

    const effectiveEmail = email.trim() || emailEl?.value?.trim() || 'user@nerevana.org';
    const effectivePassword = password.trim() || passEl?.value?.trim() || '';
    const effectiveName = fullName.trim() || nameEl?.value?.trim() || effectiveEmail.split('@')[0];

    // Validate specific credentials
    const isNyangori = effectiveEmail === 'procurement@nyangoriboys.ac.ke';
    const isElizabeth = effectiveEmail === 'elizasaloon6@gmail.com';

    if (isNyangori && effectivePassword !== 'Nyangori2026!') {
      setErrorMsg('Invalid password for Nyang\'ori Boys High School.');
      setLoading(false);
      return;
    }
    if (isElizabeth && effectivePassword !== 'ElizabethFarm2026!') {
      setErrorMsg('Invalid password for Elizabeth.');
      setLoading(false);
      return;
    }
    if (!isNyangori && !isElizabeth) {
      setErrorMsg('Invalid email account.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setTimeout(() => {
      setLoading(false);

      if (isNyangori) {
        onSignInSuccess({
          uid: 'user_nyangori',
          email: 'procurement@nyangoriboys.ac.ke',
          displayName: "Nyang'ori Boys High School",
          role: 'buyer',
          entityId: 'inst_nyangori',
        });
      } else if (isElizabeth) {
        onSignInSuccess({
          uid: 'user_elizabeth',
          email: 'elizasaloon6@gmail.com',
          displayName: 'Elizabeth',
          role: 'seller',
          entityId: 'sup_elizabeth',
        });
      } else {
        setTempUser({
          uid: 'user_' + Math.random().toString(36).substring(2, 9),
          email: effectiveEmail,
          displayName: effectiveName || 'Account User',
        });
        setStep('choose_role');
      }
    }, 150);
  };

  // Handle Google authentication
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setTempUser({
          uid: res.user.uid,
          email: res.user.email || 'user@nerevana.org',
          displayName: res.user.displayName || 'Account Holder',
        });
        setStep('choose_role');
      }
    } catch (err: unknown) {
      console.warn('Google sign-in popup closed or bypassed:', err);
      // Fallback for iframe environment
      setTempUser({
        uid: 'user_' + Math.random().toString(36).substring(2, 9),
        email: email.trim() || 'user@nerevana.org',
        displayName: fullName.trim() || 'Account Holder',
      });
      setStep('choose_role');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 submission: Finalize choice between buyer and seller
  const handleRoleSelectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUser) return;

    if (selectedRole === 'buyer') {
      onSignInSuccess({
        uid: tempUser.uid,
        email: tempUser.email,
        displayName: tempUser.displayName,
        role: 'buyer',
        entityId: 'inst_nyangori',
        customEntityName: institutionName.trim() || "Nyang'ori Boys High School",
        customAddress: organizationAddress.trim() || "Kisumu - Kakamega Highway, Kisumu, Kenya",
      });
    } else {
      onSignInSuccess({
        uid: tempUser.uid,
        email: tempUser.email,
        displayName: tempUser.displayName,
        role: 'seller',
        entityId: 'sup_elizabeth',
        customEntityName: supplierName.trim() || 'Elizabeth',
        customAddress: organizationAddress.trim() || "Kisumu Central Market - Farm Depot, Kisumu, Kenya",
        customCategory: supplierCategory || 'Fresh Garden Food',
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-white via-sky-50/50 to-blue-50/40 relative overflow-hidden">
      {/* Glossy background ambient accents */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-sky-200/40 to-blue-300/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-100/40 to-sky-200/30 blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white shadow-[0_12px_40px_rgba(2,132,199,0.08)] relative z-10">
        {/* Logo and Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3 flex items-center justify-center">
            <img
              src="/assets/aistudio/file_0000000040a4824395e1b68c717e7a9a_78bdb3ec.png"
              alt="Nerevana Logo"
              className="h-20 sm:h-24 w-auto object-contain drop-shadow-sm"
            />
          </div>

          <p className="text-xs sm:text-sm text-slate-500 max-w-xs font-medium">
            {step === 'auth'
              ? 'Institutional marketplace connecting school buyers and commercial suppliers'
              : 'Account created. Select your organization type to proceed.'}
          </p>
        </div>

        {/* STEP 1: MAKE AN ACCOUNT / SIGN IN */}
        {step === 'auth' ? (
          <div className="mt-6 space-y-4">
            {/* Toggle between Create Account and Sign In */}
            <div className="p-1 bg-slate-100 rounded-2xl flex items-center border border-slate-200/80">
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  authMode === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  authMode === 'signin'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-3 pt-1">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                  {errorMsg}
                </div>
              )}
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Chen"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@school.edu or name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                onClick={() => handleAuthSubmit()}
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm bg-sky-600 hover:bg-sky-700 text-white shadow-sm shadow-sky-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <span>{loading ? 'Processing...' : authMode === 'signup' ? 'Create Account & Continue' : 'Sign In & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Google Authentication */}
            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-slate-200"></div>
              <span className="shrink mx-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Or
              </span>
              <div className="grow border-t border-slate-200"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        ) : (
          /* STEP 2: CHOOSE A CHOICE BETWEEN THE TWO (BUYER OR SELLER) */
          <form onSubmit={handleRoleSelectionSubmit} className="mt-6 space-y-4">
            <div className="text-center">
              <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-sky-100">
                Step 2 of 2
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">Choose Your Account Type</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select whether you are procuring for an institution or supplying goods.
              </p>
            </div>

            {/* Big Choice Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Option A: Institutional Buyer */}
              <div
                onClick={() => setSelectedRole('buyer')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedRole === 'buyer'
                    ? 'border-sky-500 bg-sky-50/50 shadow-xs ring-2 ring-sky-100'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                      <School className="w-5 h-5" />
                    </div>
                    {selectedRole === 'buyer' && (
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-sm text-slate-900">Institutional Buyer</div>
                  <p className="text-xs text-slate-500 mt-1">
                    School, academy, university, or district purchasing supplies.
                  </p>
                </div>
              </div>

              {/* Option B: Commercial Supplier */}
              <div
                onClick={() => setSelectedRole('seller')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedRole === 'seller'
                    ? 'border-orange-500 bg-orange-50/50 shadow-xs ring-2 ring-orange-100'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    {selectedRole === 'seller' && (
                      <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-sm text-slate-900">Commercial Supplier</div>
                  <p className="text-xs text-slate-500 mt-1">
                    Vendor distributing stationery, STEM, cafeteria, sports, or furniture.
                  </p>
                </div>
              </div>
            </div>

            {/* Contextual Organization Details */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-3">
              {selectedRole === 'buyer' ? (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      School / Institution Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Oakridge Preparatory High School"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Campus Delivery Address
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. 2150 Hayes St, San Francisco, CA"
                        value={organizationAddress}
                        onChange={(e) => setOrganizationAddress(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-sky-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Supplier / Business Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Academic Supplies"
                      value={supplierName}
                      onChange={(e) => setSupplierName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Supply Category
                    </label>
                    <select
                      value={supplierCategory}
                      onChange={(e) => setSupplierCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-orange-500"
                    >
                      <option value="Stationery & Books">Stationery & Books</option>
                      <option value="STEM & Lab Equipment">STEM & Lab Equipment</option>
                      <option value="Catering & Cafeteria">Catering & Cafeteria</option>
                      <option value="Sports & Athletics">Sports & Athletics</option>
                      <option value="Furniture & Facilities">Furniture & Facilities</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Launch button */}
            <div className="pt-2">
              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-xl font-semibold text-sm text-white shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'buyer'
                    ? 'bg-sky-600 hover:bg-sky-700 shadow-sky-500/20'
                    : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
                }`}
              >
                <span>Enter Workspace as {selectedRole === 'buyer' ? 'School Buyer' : 'Supplier'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep('auth')}
                className="w-full text-center text-xs text-slate-400 hover:text-slate-600 mt-2 py-1 cursor-pointer"
              >
                ← Back to credentials
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
