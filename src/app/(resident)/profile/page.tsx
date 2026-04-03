"use client";

import { useAuth } from "@/context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, Settings, Bell, CircleHelp } from "lucide-react";

export default function ProfilePage() {
  const { user, profileName, role } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col pt-8 pb-32 animate-in fade-in duration-500">
      <h2 className="text-display-md font-extrabold text-primary mb-8 text-4xl">Profile</h2>

      <div className="bg-surface-container-lowest p-8 rounded-[32px] flex flex-col items-center shadow-sm border border-outline-variant/10 mb-8 mt-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-container mb-4">
          <img 
            alt="Resident Profile" 
            className="w-full h-full object-cover" 
            src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuBcNZRSsi8_fYP3EboC_WwU5XQqQL_gSeYKHdHflQvrxs135COwr8ICOavIBUzOYt4F_uElkHy5p65fXlcP-8xsRmrMj0cW0b5JnrnCT8JYGYc8YhpeuCimCBlPxkap9MwtksPwWR0NG5yWOfI_u2kNtwNeRzyT0-5LbDVkSyTo7Dn2Qs7IFXtV5mUP2zVO8veviwWHZNU6QJxdl-aNNBMBoXMTlmWXfXiCfR6bz9JeMzpinAcJ8ZWIc4kxxkzu4YTSHnGgAIlar6M"}
          />
        </div>
        <h3 className="text-3xl font-bold text-on-surface">{profileName || "Resident"}</h3>
        <p className="text-on-surface-variant font-medium mt-1">{user?.email}</p>
        <div className="mt-4 px-4 py-1.5 bg-primary-fixed text-on-primary-fixed rounded-full text-sm font-bold uppercase tracking-widest">
          {role || "Resident"}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button className="flex items-center gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-transparent hover:border-outline-variant/20 hover:bg-surface-container-low transition-all">
          <Settings className="text-primary w-6 h-6" />
          <span className="text-xl font-bold text-on-surface">Account Settings</span>
        </button>

        <button className="flex items-center gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-transparent hover:border-outline-variant/20 hover:bg-surface-container-low transition-all">
          <Bell className="text-primary w-6 h-6" />
          <span className="text-xl font-bold text-on-surface">Notifications</span>
        </button>

        <button className="flex items-center gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-transparent hover:border-outline-variant/20 hover:bg-surface-container-low transition-all">
          <CircleHelp className="text-primary w-6 h-6" />
          <span className="text-xl font-bold text-on-surface">Help & Support</span>
        </button>
      </div>

      <button 
        onClick={handleLogout}
        className="mt-12 flex items-center justify-center gap-3 bg-error-container text-on-error-container hover:bg-error hover:text-on-error p-5 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-sm"
      >
        <LogOut className="w-6 h-6" />
        Log Out
      </button>
    </div>
  );
}
