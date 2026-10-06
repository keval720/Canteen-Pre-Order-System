import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getAdminProfile } from "../services/userService";

const AdminRoute = () => {
  const { user, loading: authLoading } = useAuth();

  const [adminProfile, setAdminProfile] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setAdminProfile(null);
      setAdminLoading(false);
      return;
    }

    let isMounted = true;

    const checkAdminAccess = async () => {
      try {
        setAdminLoading(true);

        const profile = await getAdminProfile(user.uid);

        if (isMounted) {
          setAdminProfile(profile);
        }
      } catch (error) {
        console.error("Admin Access Check Error:", error);

        if (isMounted) {
          setAdminProfile(null);
        }
      } finally {
        if (isMounted) {
          setAdminLoading(false);
        }
      }
    };

    checkAdminAccess();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  if (authLoading || adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1c1917]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#3b332f] border-t-[#d15d2c]" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!adminProfile || adminProfile.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
