import { useCallback, useEffect, useMemo, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import logo from "../../assets/icons/logo.png";

import { logoutUser } from "../../services/authService";
import { subscribeToAdminProfile } from "../../services/userService";

import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();

  const [adminProfile, setAdminProfile] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // ==========================================
  // MOBILE SCREEN DETECTION
  // ==========================================

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleScreenChange = (event) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleScreenChange);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenChange);
    };
  }, []);

  // ==========================================
  // REAL-TIME ADMIN PROFILE
  // ==========================================

  useEffect(() => {
    if (!user?.uid) {
      setAdminProfile(null);
      return;
    }

    const unsubscribe = subscribeToAdminProfile(
      user.uid,
      (profile) => {
        setAdminProfile(profile);
      },
      (error) => {
        console.error("Load Admin Profile Error:", error);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  // ==========================================
  // NAVIGATION
  // ==========================================

  const handleNavigation = useCallback(
    (path) => {
      navigate(path);

      // Collapse sidebar after navigation on mobile
      if (isMobile) {
        setCollapsed(true);
      }
    },
    [navigate, isMobile, setCollapsed],
  );

  // ==========================================
  // SIDEBAR TOGGLE
  // ==========================================

  const handleToggleSidebar = useCallback(() => {
    setCollapsed((previousCollapsed) => !previousCollapsed);
  }, [setCollapsed]);

  // ==========================================
  // ADMIN LOGOUT
  // ==========================================

  const handleAdminLogout = useCallback(async () => {
    try {
      await logoutUser();

      navigate("/admin/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Admin Logout Error:", error);
    }
  }, [navigate]);

  // ==========================================
  // ACTIVE SCREEN
  // ==========================================

  const isCurrentScreen = useCallback(
    (path) => {
      return location.pathname === path;
    },
    [location.pathname],
  );

  // ==========================================
  // ADMIN NAME
  // ==========================================

  const adminName = adminProfile?.name || "Admin";

  // ==========================================
  // ADMIN INITIALS
  // ==========================================

  const adminInitials = useMemo(() => {
    if (!adminName) {
      return "A";
    }

    const nameParts = adminName.trim().split(/\s+/);

    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  }, [adminName]);

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-50 h-screen bg-[#1c1917] text-white transition-all duration-300 ${
          collapsed
            ? "w-0 overflow-visible md:w-20 md:overflow-hidden"
            : "w-full md:w-64"
        }`}
      >
        {/* ========================================== */}
        {/* LOGO */}
        {/* ========================================== */}

        <div
          className={`flex h-[70px] items-center border-b border-white/10 px-5 ${
            collapsed
              ? "absolute left-0 top-0 border-none px-3 md:static md:border-b md:px-5"
              : ""
          }`}
        >
          <button
            type="button"
            onClick={handleToggleSidebar}
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-[#d15d2c] font-semibold text-white shadow-md transition-colors hover:bg-[#b94f25]"
          >
            <img
              src={logo}
              alt="Smart Canteen logo"
              className="h-full w-full object-cover"
            />
          </button>

          {!collapsed && (
            <div className="ml-3">
              <h1 className="text-base font-semibold">Smart Canteen</h1>

              <p className="text-[10px] text-gray-400">Admin Panel</p>
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* ADMIN PROFILE */}
        {/* ========================================== */}

        <div
          className={`border-b border-white/10 px-4 py-4 ${
            collapsed ? "hidden md:block" : "block"
          }`}
        >
          <div className="flex items-center md:justify-start">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#292524] text-xs font-semibold">
              {adminInitials}
            </div>

            {!collapsed && (
              <div className="ml-3 min-w-0">
                <p className="truncate text-sm font-semibold">{adminName}</p>

                <p className="text-[10px] text-gray-400">
                  {adminProfile?.role || "Owner"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* NAVIGATION */}
        {/* ========================================== */}

        <nav
          className={`space-y-2 px-3 py-4 ${
            collapsed ? "hidden md:block" : "block"
          }`}
        >
          {/* Dashboard */}
          <button
            type="button"
            onClick={() => handleNavigation("/admin/dashboard")}
            className={`flex w-full items-center rounded-xl px-3 py-3 transition-colors ${
              collapsed ? "justify-center" : "gap-3"
            } ${
              isCurrentScreen("/admin/dashboard")
                ? "bg-[#d15d2c] text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="shrink-0 text-lg">▦</span>

            {!collapsed && (
              <span
                className={`text-sm ${
                  isCurrentScreen("/admin/dashboard") ? "font-semibold" : ""
                }`}
              >
                Dashboard
              </span>
            )}
          </button>

          {/* Menu */}
          <button
            type="button"
            onClick={() => handleNavigation("/admin/managemenu")}
            className={`flex w-full items-center rounded-xl px-3 py-3 transition-colors ${
              collapsed ? "justify-center" : "gap-3"
            } ${
              isCurrentScreen("/admin/managemenu")
                ? "bg-[#d15d2c] text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="shrink-0 text-lg">☷</span>

            {!collapsed && (
              <span
                className={`text-sm ${
                  isCurrentScreen("/admin/managemenu") ? "font-semibold" : ""
                }`}
              >
                Menu
              </span>
            )}
          </button>

          {/* Orders */}
          <button
            type="button"
            onClick={() => handleNavigation("/admin/manageorders")}
            className={`flex w-full items-center rounded-xl px-3 py-3 transition-colors ${
              collapsed ? "justify-center" : "gap-3"
            } ${
              isCurrentScreen("/admin/manageorders")
                ? "bg-[#d15d2c] text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="shrink-0 text-lg">🛒</span>

            {!collapsed && (
              <span
                className={`text-sm ${
                  isCurrentScreen("/admin/manageorders") ? "font-semibold" : ""
                }`}
              >
                Orders
              </span>
            )}
          </button>

          {/* Reports */}
          <button
            type="button"
            onClick={() => handleNavigation("/admin/report")}
            className={`flex w-full items-center rounded-xl px-3 py-3 transition-colors ${
              collapsed ? "justify-center" : "gap-3"
            } ${
              isCurrentScreen("/admin/report")
                ? "bg-[#d15d2c] text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="shrink-0 text-lg">▥</span>

            {!collapsed && (
              <span
                className={`text-sm ${
                  isCurrentScreen("/admin/report") ? "font-semibold" : ""
                }`}
              >
                Reports
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            type="button"
            onClick={() => handleNavigation("/admin/profile")}
            className={`flex w-full items-center rounded-xl px-3 py-3 transition-colors ${
              collapsed ? "justify-center" : "gap-3"
            } ${
              isCurrentScreen("/admin/profile")
                ? "bg-[#d15d2c] text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="shrink-0 text-lg">♙</span>

            {!collapsed && (
              <span
                className={`text-sm ${
                  isCurrentScreen("/admin/profile") ? "font-semibold" : ""
                }`}
              >
                Profile
              </span>
            )}
          </button>
        </nav>

        {/* ========================================== */}
        {/* LOGOUT */}
        {/* ========================================== */}

        <div
          className={`absolute bottom-0 left-0 w-full px-3 pb-4 ${
            collapsed ? "hidden md:block" : "block"
          }`}
        >
          <button
            type="button"
            onClick={handleAdminLogout}
            className={`flex w-full items-center rounded-xl px-3 py-3 text-red-400 hover:bg-red-500/10 ${
              collapsed ? "justify-center" : "gap-3"
            }`}
          >
            <span className="shrink-0 text-lg">↪</span>

            {!collapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
