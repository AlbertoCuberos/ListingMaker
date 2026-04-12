"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { getBrowserAuth, getBrowserFirestore } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { ListingMakerProfile } from "./types";
import { useRouter } from "next/navigation";
import { isUserAdmin } from "./admins";

interface AuthContextType {
  user: User | null;
  profile: ListingMakerProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  // Modal state
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authView: "login" | "signup";
  setAuthView: (view: "login" | "signup") => void;
  signInWithGoogle: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
  isAuthModalOpen: false,
  setAuthModalOpen: () => {},
  authView: "login",
  setAuthView: () => {},
  signInWithGoogle: async () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ListingMakerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const router = useRouter();

  const auth = getBrowserAuth();
  const db = getBrowserFirestore();

  const isAdmin = isUserAdmin(user?.email);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const profileRef = doc(db, "profiles", userId);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        setProfile(profileSnap.data() as ListingMakerProfile);
        return profileSnap.data() as ListingMakerProfile;
      }
      return null;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }, [db]);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.uid);
  }, [user, fetchProfile]);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, fetchProfile]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
    router.push("/");
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      // Check if profile exists with a small delay to ensure Auth state propagation
      // This helps prevent "permission-denied" on first read for new accounts
      let existingProfile = null;
      try {
        existingProfile = await fetchProfile(firebaseUser.uid);
      } catch (e) {
        console.warn("Initial profile fetch failed, retrying...", e);
        await new Promise(r => setTimeout(r, 800));
        existingProfile = await fetchProfile(firebaseUser.uid);
      }

      if (!existingProfile) {
        const newProfile: ListingMakerProfile = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          fullName: firebaseUser.displayName,
          creditsRemaining: 1, // Free listing
          plan: "free",
          stripeCustomerId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        try {
          await setDoc(doc(db, "profiles", firebaseUser.uid), newProfile);
          setProfile(newProfile);
        } catch (writeError: any) {
          console.error("Firestore Profile Creation Error:", writeError);
          // If it's a permission error, it's likely the rules haven't been deployed
          if (writeError.code === "permission-denied") {
            throw new Error("permission-denied");
          }
          throw writeError;
        }
      }
      setAuthModalOpen(false);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signOut, 
      refreshProfile,
      isAuthModalOpen,
      setAuthModalOpen,
      authView,
      setAuthView,
      signInWithGoogle,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
