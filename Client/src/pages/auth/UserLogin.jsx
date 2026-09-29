import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/icons/logo.png";

import { loginUser, logoutUser } from "../../services/authService";

import {
  createUserProfile,
  deletePendingRegistration,
  getPendingRegistration,
  getUserProfile,
} from "../../services/userService";

const UserLogin = () => {
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      // Firebase login
      const user = await loginUser(email.trim(), password);

      // Check email verification
      if (!user.emailVerified) {
        await logoutUser();

        setError(
          "Please verify your email before logging in. Check your spam or inbox also for the verification email.",
        );

        return;
      }

      // Check existing Firestore profile
      const existingProfile = await getUserProfile(user.uid);

      if (existingProfile) {
        // Validate selected role
        if (existingProfile.role !== role) {
          await logoutUser();

          setError(
            `This account is registered as ${
              existingProfile.role === "student" ? "Student" : "Faculty"
            }. Please select the correct role.`,
          );

          return;
        }

        // Role matches
        navigate("/user/home");
        return;
      }

      // Get temporary registration data
      const pendingRegistration = await getPendingRegistration(user.uid);

      if (!pendingRegistration) {
        await logoutUser();

        setError(
          "Your registration information was not found. Please register again.",
        );

        return;
      }

      // Validate selected role
      if (pendingRegistration.role !== role) {
        await logoutUser();

        setError(
          `This account is registered as ${
            pendingRegistration.role === "student" ? "Student" : "Faculty"
          }. Please select the correct role.`,
        );

        return;
      }

      // Create real Firestore profile
      await createUserProfile(user.uid, {
        name: pendingRegistration.name || user.displayName || "",
        email: user.email,
        role: pendingRegistration.role,
      });

      // Delete temporary registration
      await deletePendingRegistration(user.uid);

      // Login successful
      navigate("/user/home");
    } catch (error) {
      console.error("Login Error:", error);

      if (error.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (error.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPass = () => {
    navigate("/resetPass");
  };

  return (
    <>
      <div className="min-h-screen flex bg-[#f9f6f1]">
        {/* ================= LEFT SECTION ================= */}
        <div className="hidden lg:flex lg:w-[35%] bg-[#d15d2c] text-white p-9 flex-col justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <img src={logo} alt="logo" />
            </div>

            <h1 className="text-2xl font-bold">Smart Canteen</h1>
          </div>

          {/* Main Text */}
          <div>
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
              Give a Pre-Order and
              <br />
              <span className="italic">skip the queue,</span>
              <br />
              order smarter.
            </h2>

            <p className="mt-5 text-sm leading-6 text-orange-100 max-w-sm">
              Order your favourite canteen meals in advance and pick them up at
              your chosen time — no waiting, no rush.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <div className="bg-[#df7045] rounded-xl p-4">
              <p className="font-semibold">⚡ Quick Ordering</p>

              <p className="text-xs text-orange-100 mt-1">
                Add items & checkout in under 2 minutes
              </p>
            </div>

            <div className="bg-[#df7045] rounded-xl p-4">
              <p className="font-semibold">🕐 Choose Your Time</p>

              <p className="text-xs text-orange-100 mt-1">
                Pick a future pickup slot that fits your schedule
              </p>
            </div>

            <div className="bg-[#df7045] rounded-xl p-4">
              <p className="font-semibold">🍱 Fresh & Hot</p>

              <p className="text-xs text-orange-100 mt-1">
                Food prepared fresh at your pickup time
              </p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SECTION ================= */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            {/* Back */}
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-500 hover:text-[#d15d2c] mb-8"
            >
              ← Back
            </button>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
              Welcome back 👋
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Login to your Smart Canteen account
            </p>

            <form onSubmit={handleLogin}>
              {/* Role */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select your role
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Student */}
                  <label
                    className={`flex items-center py-3 px-5 rounded-xl border-2 cursor-pointer transition
        ${
          role === "student"
            ? "border-[#d15d2c] bg-[#fff7f2]"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
                  >
                    {/* Custom Radio */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3
          ${role === "student" ? "border-[#d15d2c]" : "border-gray-300"}`}
                    >
                      {role === "student" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#d15d2c]" />
                      )}
                    </div>

                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={role === "student"}
                      onChange={(e) => setRole(e.target.value)}
                      className="sr-only"
                    />

                    <span className="text-2xl">🎓</span>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Student</h3>
                    </div>
                  </label>

                  {/* Faculty */}
                  <label
                    className={`flex items-center py-3 px-5 rounded-xl border-2 cursor-pointer transition
        ${
          role === "faculty"
            ? "border-[#d15d2c] bg-[#fff7f2]"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
                  >
                    {/* Custom Radio */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3
          ${role === "faculty" ? "border-[#d15d2c]" : "border-gray-300"}`}
                    >
                      {role === "faculty" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#d15d2c]" />
                      )}
                    </div>

                    <input
                      type="radio"
                      name="role"
                      value="faculty"
                      checked={role === "faculty"}
                      onChange={(e) => setRole(e.target.value)}
                      className="sr-only"
                    />

                    <span className="text-2xl">👨‍🏫</span>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Faculty</h3>
                    </div>
                  </label>
                </div>
              </div>

              {/* Email */}
              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#d15d2c] focus:ring-1 focus:ring-[#d15d2c]"
                />
              </div>

              {/* Password */}
              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-20 outline-none focus:border-[#d15d2c] focus:ring-1 focus:ring-[#d15d2c]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-[#d15d2c]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  className="text-sm text-[#d15d2c] font-medium hover:underline"
                  onClick={handleForgetPass}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-100 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              {/* Login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-7 py-4 rounded-xl bg-[#d15d2c] text-white font-semibold hover:bg-[#bd5125] active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Logging in..."
                  : `Login as ${role === "student" ? "Student" : "Faculty"}`}
              </button>
            </form>

            {/* Register */}
            <p className="text-center text-sm text-gray-500 mt-7">
              New here?{" "}
              <button
                onClick={() => navigate("/user/register")}
                className="text-[#d15d2c] font-semibold hover:underline"
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLogin;
