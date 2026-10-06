import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await loginUser(email.trim(), password);

      navigate("/admin");
    } catch (error) {
      console.error("Admin Login Error:", error);

      if (error.code === "auth/invalid-credential") {
        setError("Invalid admin email or password.");
      } else if (error.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Unable to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1c1917] px-4 py-10">
      <div className="w-full max-w-sm">
        {/* ================= BRANDING ================= */}
        <div className="mb-8 text-center">
          {/* Logo */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d15d2c] text-2xl font-semibold text-white">
            SC
          </div>

          {/* Brand */}
          <h1 className="mt-4 text-3xl font-semibold text-white">
            Smart Canteen
          </h1>

          <p className="mt-1 text-sm text-gray-500">Admin & Owner Portal</p>
        </div>

        {/* ================= LOGIN CARD ================= */}
        <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-7">
          <h2 className="text-lg font-medium text-gray-900">
            Sign in to Dashboard
          </h2>

          <form onSubmit={handleLogin}>
            {/* ================= EMAIL ================= */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Admin Email
              </label>

              <div className="relative">
                {/* Icon */}
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ♙
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  placeholder="admin@canteen.edu"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-[#e5d4c8] bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#d15d2c] focus:ring-1 focus:ring-[#d15d2c] disabled:cursor-not-allowed disabled:bg-gray-50"
                />
              </div>
            </div>

            {/* ================= PASSWORD ================= */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-900">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-[#e5d4c8] bg-white py-3 pl-4 pr-16 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#d15d2c] focus:ring-1 focus:ring-[#d15d2c] disabled:cursor-not-allowed disabled:bg-gray-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-[#d15d2c] disabled:cursor-not-allowed"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* ================= ERROR ================= */}
            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* ================= BUTTON ================= */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-[#d15d2c] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#bd5125] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Access Dashboard"}
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
};

export default AdminLogin;
