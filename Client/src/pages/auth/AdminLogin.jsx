import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    navigate("/admin");
  };

  // const handleAdminLogin = () => {
  //   alert("Admin login successful");
  // }

  return (
    <div className="min-h-screen bg-[#1c1917] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        {/* ================= BRANDING ================= */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#d15d2c] flex items-center justify-center text-white text-2xl font-semibold">
            SC
          </div>

          {/* Brand */}
          <h1 className="mt-4 text-3xl font-semibold text-white">
            Smart Canteen
          </h1>

          <p className="mt-1 text-sm text-gray-500">Admin & Owner Portal</p>
        </div>

        {/* ================= LOGIN CARD ================= */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xl">
          <h2 className="text-lg font-medium text-gray-900">
            Sign in to Dashboard
          </h2>

          <form onSubmit={handleLogin}>
            {/* ================= EMAIL ================= */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Admin Email
              </label>

              <div className="relative">
                {/* Icon */}
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ♙
                </span>

                <input
                  type="email"
                  placeholder="admin@canteen.edu"
                  required
                  className="w-full rounded-xl border border-[#e5d4c8] bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#d15d2c] focus:ring-1 focus:ring-[#d15d2c]"
                />
              </div>
            </div>

            {/* ================= PASSWORD ================= */}
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-[#e5d4c8] bg-white py-3 pl-4 pr-16 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#d15d2c] focus:ring-1 focus:ring-[#d15d2c]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-[#d15d2c]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* ================= BUTTON ================= */}
            <button
              type="submit"
              className="w-full mt-6 rounded-xl bg-[#d15d2c] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#bd5125] active:scale-[0.99]"
            >
              Access Dashboard
            </button>
          </form>

          {/* ================= RESTRICTED MESSAGE ================= */}
          <p className="mt-5 text-center text-xs text-[#b99585]">
            Restricted to authorized canteen staff only
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
