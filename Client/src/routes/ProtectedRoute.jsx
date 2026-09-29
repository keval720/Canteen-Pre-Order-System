import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f2]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#eadfd6] border-t-[#d15d2c]" />
      </div>
    );
  }

  if (!user || !user.emailVerified) {
    return <Navigate to="/user/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
