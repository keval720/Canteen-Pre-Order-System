import { createContext, useContext, useEffect, useState } from "react";

import { subscribeToAuthChanges } from "../services/authService";
import { subscribeToUserProfile } from "../services/userService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile = null;
    let authChangeVersion = 0;

    const unsubscribeAuth = subscribeToAuthChanges((currentUser) => {
      const currentVersion = ++authChangeVersion;

      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      setUser(currentUser);

      if (!currentUser || !currentUser.emailVerified) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      unsubscribeProfile = subscribeToUserProfile(
        currentUser.uid,
        (userProfile) => {
          if (currentVersion !== authChangeVersion) return;

          setProfile(userProfile);
          setLoading(false);
        },
        (error) => {
          if (currentVersion !== authChangeVersion) return;

          console.error("Load User Profile Error:", error);
          setProfile(null);
          setLoading(false);
        },
      );
    });

    return () => {
      authChangeVersion++;
      unsubscribeAuth();

      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
