"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  role: "resident" | "admin" | null;
  profileName: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, role: null, profileName: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"resident" | "admin" | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Fetch or create role
        try {
          const userRef = doc(db, "users", user.uid);
          
          // Use timeout resolution to avoid Unhandled Rejections in NextJS overlay
          let timeoutId: NodeJS.Timeout;
          const timeoutPromise = new Promise<{ _timeout: boolean }>((resolve) => {
            timeoutId = setTimeout(() => resolve({ _timeout: true }), 800);
          });
          
          const userSnap = await Promise.race([
            getDoc(userRef),
            timeoutPromise
          ]) as any;
          
          clearTimeout(timeoutId!); // Cancel the timer if getDoc finishes first!
          
          if (userSnap && userSnap._timeout) {
            // Silently bypass offline timeout
            const cachedRole = typeof window !== "undefined" ? localStorage.getItem('panchayat_role') : null;
            setRole((cachedRole as any) || "resident");
            setProfileName(user.email?.split("@")[0] || "Resident");
            setLoading(false);
            return;
          }
          
          if (userSnap && typeof userSnap.exists === "function" && userSnap.exists()) {
            const data = userSnap.data();
            setRole(data.role as "resident" | "admin");
            setProfileName(data.name || user.email?.split("@")[0] || "Resident");
            if (typeof window !== "undefined") {
              localStorage.setItem('panchayat_role', data.role);
            }
          } else {
            const fallbackName = user.email?.split("@")[0] || "Resident";
            await setDoc(userRef, {
              name: fallbackName,
              email: user.email,
              role: "resident", // default to resident
              createdAt: new Date(),
            });
            setRole("resident");
            setProfileName(fallbackName);
            if (typeof window !== "undefined") {
              localStorage.setItem('panchayat_role', "resident");
            }
          }
        } catch (error) {
          console.warn("Firestore gracefully bypassed offline:", error);
          const cachedRole = typeof window !== "undefined" ? localStorage.getItem('panchayat_role') : null;
          setRole((cachedRole as any) || "resident");
          setProfileName(user.email?.split("@")[0] || "Resident");
        }
      } else {
        setRole(null);
        setProfileName(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem('panchayat_role');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, role, profileName, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
