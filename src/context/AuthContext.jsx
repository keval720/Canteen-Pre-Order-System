import { createContext, useContext, useEffect, useState } from "react";

import { subscribeToAuthChanges } from "../services/authService";
import { getUserProfile } from "../services/userService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      if (!currentUser.emailVerified) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const userProfile = await getUserProfile(currentUser.uid);

        setProfile(userProfile);
      } catch (error) {
        console.error("Load User Profile Error:", error);

        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
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
