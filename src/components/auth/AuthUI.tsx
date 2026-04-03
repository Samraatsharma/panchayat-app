"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

export function AuthUI() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

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
        // Set the name immediately
        await setDoc(doc(db, "users", userCred.user.uid), {
          name: name || email.split("@")[0],
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
      else setError(err.message || "Authentication failed.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-8 justify-center min-h-[70vh] items-center px-4">
      <div className="w-full max-w-sm bg-slate-900 mx-auto rounded-3xl p-8 border border-slate-800 shadow-xl shadow-blue-500/10">
        <h2 className="text-3xl font-extrabold text-white mb-2">
          {isLogin ? "Welcome Back" : "Join Panchayat"}
        </h2>
        <p className="text-slate-400 mb-8 text-sm">
          {isLogin ? "Enter your core credentials to access the society dashboard." : "Create a new free resident account."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Ex. Samraat Sharma"
                className="bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-4 text-lg focus:outline-none focus:border-blue-500 transition-colors"
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Ex. me@society.com"
              className="bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-4 text-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              className="bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-4 text-lg focus:outline-none focus:border-blue-500 transition-colors tracking-widest"
              required
              minLength={6}
            />
          </div>

          {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
          
          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? "Please wait..." : (isLogin ? "Secure Login" : "Create Account")}
          </Button>

          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-500 hover:text-white text-sm mt-4 tracking-wide transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already a resident? Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
