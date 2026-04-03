"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = '/dashboard';
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCred.user.uid), {
          name: email.split("@")[0],
          email: email,
          role: "resident",
          createdAt: new Date(),
        });
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found") setError("No user found. Please sign up.");
      else if (err.code === "auth/wrong-password") setError("Incorrect password.");
      else if (err.code === "auth/email-already-in-use") setError("Email already registered. Please sign in instead.");
      else setError(err.message || "Authentication failed.");
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-primary">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="text-on-surface min-h-screen flex flex-col items-center justify-center selection:bg-primary-fixed bg-background">
      {/* Top AppBar - Suppressed Nav, Simple Branding */}
      <header className="w-full fixed top-0 left-0 flex items-center justify-between px-8 py-6 z-50">
        <div className="flex items-center gap-2">
          <span className="text-primary font-black text-3xl tracking-tight">Panchayat</span>
        </div>
        <button className="bg-surface-container-low px-6 py-3 rounded-full flex items-center gap-2 hover:bg-surface-container transition-colors group">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>language</span>
          <span className="font-bold text-primary">English</span>
          <span className="text-outline-variant">|</span>
          <span className="text-on-surface-variant group-hover:text-primary transition-colors">हिंदी</span>
        </button>
      </header>
      
      {/* Main Content Canvas */}
      <main className="w-full max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center pt-24 pb-12 z-10">
        {/* Left Column: Editorial Brand Presence */}
        <section className="hidden md:flex flex-col gap-8">
          <div className="space-y-4">
            <h1 className="text-primary font-black text-6xl leading-[1.1] tracking-tighter">
              The Digital <br/>Concierge for <br/>Modern Living.
            </h1>
            <p className="text-on-surface-variant text-xl max-w-md leading-relaxed">
              Designed for dignity. Built for trust. Panchayat bridges the gap between traditional management and effortless technology.
            </p>
          </div>
          <div className="bg-surface-container-low p-10 rounded-[2.5rem] flex flex-col gap-6">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-secondary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary">Secure Society Portal</h3>
                <p className="text-on-surface-variant">Over 2,500 societies trust Panchayat for transparent governance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Login/Signup Form */}
        <section className="w-full">
          <div className="bg-surface-container-lowest p-8 md:p-12 rounded-[3rem] shadow-[0_12px_40px_rgba(0,0,0,0.04)] flex flex-col gap-10 border border-outline-variant/20">
            <div className="space-y-2">
              <h2 className="text-4xl font-extrabold text-primary tracking-tight">
                {isLogin ? "Welcome back" : "Join Panchayat"}
              </h2>
              <p className="text-on-surface-variant text-lg">
                {isLogin ? "Enter your details to access your dashboard." : "Create your free resident account."}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="space-y-3">
                <label className="text-primary font-bold text-lg px-2">Email Address</label>
                <div className="relative group">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-20 bg-surface-container-low rounded-2xl px-6 text-xl border-none focus:ring-4 focus:ring-secondary transition-all placeholder:text-outline outline-none" 
                    placeholder="Enter email" 
                    required
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant text-2xl">contact_mail</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center px-2">
                  <label className="text-primary font-bold text-lg">Password</label>
                  {isLogin && <button type="button" className="text-secondary font-bold hover:underline">Forgot?</button>}
                </div>
                <div className="relative group">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-20 bg-surface-container-low rounded-2xl px-6 text-xl border-none focus:ring-4 focus:ring-secondary transition-all placeholder:text-outline outline-none" 
                    placeholder="••••••••" 
                    required
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant text-2xl">visibility</span>
                </div>
              </div>

              {error && <p className="text-error font-medium px-2">{error}</p>}

              <div className="flex flex-col gap-4 mt-4">
                <button disabled={loading} type="submit" className="w-full h-20 bg-gradient-to-r from-primary to-primary-container text-white rounded-3xl text-xl font-bold shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform disabled:opacity-70 cursor-pointer">
                  {loading ? "Please wait..." : (isLogin ? "Login to Dashboard" : "Create Account")}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <div className="flex items-center gap-4 py-2">
                  <div className="h-[1px] flex-grow bg-surface-container-highest"></div>
                  <span className="text-outline text-sm font-bold">OR</span>
                  <div className="h-[1px] flex-grow bg-surface-container-highest"></div>
                </div>
              </div>
            </form>
            
            <p className="text-center text-on-surface-variant font-medium">
              {isLogin ? "New to your building? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-secondary font-extrabold hover:underline">
                {isLogin ? "Create Account" : "Sign in here"}
              </button>
            </p>
          </div>
        </section>
      </main>

      {/* Voice FAB */}
      <div className="w-full max-w-6xl px-6 mb-8 flex justify-center z-10">
        <button className="flex flex-col items-center gap-3 group transition-transform hover:scale-105 active:scale-95">
          <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl ring-8 ring-primary-fixed-dim">
            <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
          </div>
          <div className="flex flex-col items-center">
             <span className="text-primary font-black text-xl tracking-tight uppercase">Voice Help</span>
             <span className="text-on-surface-variant font-medium">Tap to speak in English or हिंदी</span>
          </div>
        </button>
      </div>

      <div className="fixed top-0 right-0 -z-10 w-1/3 h-full overflow-hidden opacity-10 pointer-events-none">
        <img className="w-full h-full object-cover grayscale" alt="Modern architectural lines of a clean white residential building against a clear sky, minimalist luxury aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1juL9q_WLSu_SRRGNnpYuIECOBj4gqLzDhikc0IuvXQaoFSqUze9PuGtLvVXbCRG0oLofiodPpQt72zJZTDtQg_G4Qd3mQQ9bWjy7U5689GK1FFV-YbSyxdl5-DTSgH7LOPbNfgQ3MPxQD2BZIxP1E2zsaKDTN1y2sL3JQ9tu0zL6RqPj4HpQldBA24txc7inCaNhOMwNvY3KhU9nZuZu1fX5_A8mmEJz9uImzbvKYPnJISfyV2LPBm7WmHXQ57Jwk9ljrw7l6jw"/>
      </div>

      <footer className="bottom-0 left-0 w-full p-8 flex justify-center relative z-10">
        <div className="flex gap-8 text-sm font-medium text-on-surface-variant">
          <button className="hover:text-primary transition-colors">Privacy Policy</button>
          <button className="hover:text-primary transition-colors">Accessibility Options</button>
          <button className="hover:text-primary transition-colors">Contact Support</button>
        </div>
      </footer>
    </div>
  );
}
