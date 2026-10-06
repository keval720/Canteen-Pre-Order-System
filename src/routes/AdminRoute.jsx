import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1c1917]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#3b332f] border-t-[#d15d2c]" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (profile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;