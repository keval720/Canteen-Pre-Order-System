import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../../services/authService";
import { savePendingRegistration } from "../../services/userService";

const UserRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [countdown, setCountdown] = useState(8);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const user = await registerUser(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
      );

      await savePendingRegistration(user.uid, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
      });

      setRegistered(true);
    } catch (error) {
      console.error("Registration Error:", error);

      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!registered) return;

    if (countdown === 0) {
      navigate("/user/login");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [registered, countdown, navigate]);

  if (registered) {
    const progress = (countdown / 8) * 100;

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f7e4da]">
            <span className="text-3xl text-[#d15d2c]">✓</span>
          </div>

          <h1 className="mb-3 text-2xl font-bold text-[#3d3029]">
            Registration Successful
          </h1>

          <p className="mb-2 text-sm leading-6 text-[#5f5048]">
            📩{" "}
            <span className="font-semibold text-[#d15d2c]">
              Verification email sent!
            </span>{" "}
            Please check your inbox.
          </p>

          <p className="text-sm leading-6 text-[#5f5048]">
            🔐{" "}
            <span className="font-semibold text-[#d15d2c]">
              Verify your email
            </span>{" "}
            before logging in.
          </p>

          <p className="mt-6 text-sm font-medium text-[#3d3029]">
            Redirecting to login in {countdown} seconds...
          </p>

          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-[#f1e7df]">
            <div
              className="h-full bg-[#d15d2c] transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-[#3d3029]">Create Account</h1>

          <p className="mt-2 text-sm text-[#75665d]">
            Register to use Smart Canteen
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select your role
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Student */}
              <label
                className={`flex items-center py-3 px-5 rounded-xl border-2 cursor-pointer transition
        ${
          formData.role === "student"
            ? "border-[#d15d2c] bg-[#fff7f2]"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3
          ${
            formData.role === "student" ? "border-[#d15d2c]" : "border-gray-300"
          }`}
                >
                  {formData.role === "student" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#d15d2c]" />
                  )}
                </div>

                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === "student"}
                  onChange={handleChange}
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
          formData.role === "faculty"
            ? "border-[#d15d2c] bg-[#fff7f2]"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3
          ${
            formData.role === "faculty" ? "border-[#d15d2c]" : "border-gray-300"
          }`}
                >
                  {formData.role === "faculty" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#d15d2c]" />
                  )}
                </div>

                <input
                  type="radio"
                  name="role"
                  value="faculty"
                  checked={formData.role === "faculty"}
                  onChange={handleChange}
                  className="sr-only"
                />

                <span className="text-2xl">👨‍🏫</span>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Faculty</h3>
                </div>
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-[#3d3029]"
            >
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-[#eadfd6] bg-white px-4 py-3 text-sm text-[#3d3029] outline-none transition placeholder:text-[#a99a91] focus:border-[#d15d2c]"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#3d3029]"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-[#eadfd6] bg-white px-4 py-3 text-sm text-[#3d3029] outline-none transition placeholder:text-[#a99a91] focus:border-[#d15d2c]"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#3d3029]"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-[#eadfd6] bg-white px-4 py-3 text-sm text-[#3d3029] outline-none transition placeholder:text-[#a99a91] focus:border-[#d15d2c]"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-[#3d3029]"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full rounded-xl border border-[#eadfd6] bg-white px-4 py-3 text-sm text-[#3d3029] outline-none transition placeholder:text-[#a99a91] focus:border-[#d15d2c]"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#d15d2c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#b94f24] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#75665d]">
          Already have an account?{" "}
          <Link
            to="/user/login"
            className="font-semibold text-[#d15d2c] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
