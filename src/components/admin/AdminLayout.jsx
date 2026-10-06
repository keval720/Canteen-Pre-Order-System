import { useEffect, useState } from "react";

import Sidebar from "./Sidebar";

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(max-width: 767px)").matches;
  });

  // ==========================================
  // RESPONSIVE SIDEBAR STATE
  // ==========================================

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleScreenChange = (event) => {
      setCollapsed(event.matches);
    };

    mediaQuery.addEventListener("change", handleScreenChange);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f6f1]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? "ml-0 md:ml-20" : "ml-0 md:ml-64"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
