import { useState } from "react";
import Sidebar from "./Sidebar";

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
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
    </>
  );
};

export default AdminLayout;
