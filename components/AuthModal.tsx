"use client";

import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { getBrowserAuth, getBrowserFirestore } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    setAuthModalOpen, 
    authView, 
    setAuthView,
    signInWithGoogle
  } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Real mount check
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isAuthModalOpen || !mounted) return null;

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      if (err.message === "permission-denied" || err.code === "permission-denied") {
        setError("Error de configuración: Las reglas de la base de datos no permiten crear tu perfil. Por favor, revisa la pestaña 'Rules' en tu consola de Firebase.");
      } else {
        setError(err.message || "Error al iniciar sesión con Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const auth = getBrowserAuth();
    const db = getBrowserFirestore();

    try {
      if (authView === "signup") {
        if (password.length < 6) {
          throw new Error("La contraseña debe tener al menos 6 caracteres.");
        }
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName: fullName });
        
        try {
          await setDoc(doc(db, "profiles", user.uid), {
            id: user.uid,
            email: user.email,
            fullName: fullName,
            creditsRemaining: 1,
            plan: "free",
            stripeCustomerId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } catch (dbErr: any) {
          if (dbErr.code === "permission-denied") {
            setError("Usuario creado, pero no pudimos crear tu perfil. Por favor, activa las reglas de Firestore en tu consola.");
            return;
          }
          throw dbErr;
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setAuthModalOpen(false);
      // Small delay to allow onAuthStateChanged to propagate before navigating
      await new Promise(r => setTimeout(r, 400));
      router.push("/dashboard");
    } catch (err: any) {
      const code = err.code || "";
      if (code === "auth/email-already-in-use") {
        setError("Ese email ya está registrado. Prueba a iniciar sesión.");
      } else if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        setError("Email o contraseña incorrectos.");
      } else if (code === "auth/too-many-requests") {
        setError("Demasiados intentos fallidos. Espera unos minutos e inténtalo de nuevo.");
      } else if (code === "auth/network-request-failed") {
        setError("Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.");
      } else if (code === "auth/invalid-email") {
        setError("El formato del email no es válido.");
      } else if (code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else if (code === "auth/operation-not-allowed") {
        setError("El registro con email no está disponible en este momento. Usa Google.");
      } else {
        setError("Algo salió mal. Inténtalo de nuevo o usa Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setAuthModalOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-[420px] bg-[#0a0a10] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-glow"
        >
          <div className="p-8 pb-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    alt="ListingMaker Logo" 
                    className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                  />
                </div>
                <span className="font-display font-bold text-lg text-white tracking-tight leading-none">
                  Listing<span className="text-orange-400">Maker</span>
                </span>
              </div>
              <button 
                onClick={() => setAuthModalOpen(false)}
                className="text-gray-500 hover:text-white transition p-1"
              >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold text-white mb-2 leading-tight">
                {authView === "signup" ? t.auth.title : t.auth.loginTitle}
              </h2>
              <p className="text-gray-400 text-sm">{t.auth.subtitle}</p>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
              {authView === "signup" && (
                <div>
                   <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5 ml-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:border-orange-500 outline-none transition text-sm shadow-inner"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              )}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5 ml-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder={t.auth.emailPlaceholder}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:border-orange-500 outline-none transition text-sm shadow-inner"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1.5 ml-1">Contraseña</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder={t.auth.passwordPlaceholder}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:border-orange-500 outline-none transition text-sm shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-2.5 px-3 rounded-xl font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 text-white font-bold py-4 rounded-2xl shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_30px_rgba(249,115,22,0.4)] transition-all duration-300 transform active:scale-[0.98]"
              >
                {loading ? t.auth.loading : (authView === "signup" ? t.auth.signupTitle : t.auth.loginTitle)}
              </button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold"><span className="bg-[#0a0a10] px-3 text-gray-600">O continuar con</span></div>
            </div>

            {/* Google Social Auth - Official Branding */}
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/95 text-gray-700 font-medium py-3 rounded-2xl transition-all duration-300 shadow-md group border border-gray-200 disabled:opacity-50"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 1 24 24" className="w-full h-full">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 1.1-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              {t.auth.googleButton}
            </button>

            <div className="mt-8 text-center text-sm">
              <span className="text-gray-500">
                {authView === "signup" ? t.auth.hasAccount : t.auth.noAccount}{" "}
              </span>
              <button
                onClick={() => setAuthView(authView === "signup" ? "login" : "signup")}
                className="text-orange-400 font-bold hover:text-orange-300 transition"
              >
                {authView === "signup" ? t.auth.switchToLogin : t.auth.switchToSignup}
              </button>
            </div>
          </div>

          {/* Trust Area */}
          <div className="bg-white/3 border-t border-white/5 p-4 flex items-center justify-around">
            {[
              t.auth.trustSignals.listingFree,
              t.auth.trustSignals.noCreditCard,
              t.auth.trustSignals.fastAuth,
            ].map((label) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="text-[10px] uppercase tracking-tighter text-green-400 font-bold">{label}</span>
                <div className="text-green-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
