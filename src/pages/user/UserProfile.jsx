import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/authService";
import { getUserProfile, updateUserProfile } from "../../services/userService";

const UserProfile = () => {
  const navigate = useNavigate();

  const { user, profile, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [completedOrders, setCompletedOrders] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        return;
      }

      try {
        const userProfile = profile || (await getUserProfile(user.uid));

        if (userProfile) {
          setFormData({
            name: userProfile.name || "",
            email: userProfile.email || user.email || "",
            phone: userProfile.phone || "",
          });
        }
      } catch (error) {
        console.error("Load Profile Error:", error);
        setError("Unable to load your profile.");
      }
    };

    if (!authLoading) {
      loadProfile();
    }
  }, [user, profile, authLoading]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // ==========================================
  // SAVE CHANGES
  // ==========================================

  const handleSave = async (e) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      await updateUserProfile(user.uid, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      });

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Update Profile Error:", error);
      setError("Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/user/login");
    } catch (error) {
      console.error("Logout Error:", error);
      setError("Unable to sign out. Please try again.");
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#faf7f2]">
        <Navbar />

        <div className="flex min-h-[500px] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#eadfd6] border-t-[#d15d2c]" />
        </div>
      </div>
    );
  }

  // ==========================================
  // USER
  // ==========================================

  const currentName =
    formData.name || profile?.name || user?.displayName || "User";

  const currentEmail = formData.email || profile?.email || user?.email || "";

  const currentRole = profile?.role || "student";

  const roleText = currentRole === "faculty" ? "Faculty" : "Student";

  const initials = currentName
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <main className="mx-auto w-full max-w-[1050px] px-4 pb-[60px] pt-[25px] sm:px-6 lg:px-0">
        {/* ==========================================
            HEADING
        ========================================== */}

        <h1 className="font-serif text-[25px] text-[#171717]">My Profile</h1>

        {/* ==========================================
            PROFILE HEADER
        ========================================== */}

        <section className="mt-[16px] rounded-[15px] bg-gradient-to-r from-[#ce5b2b] to-[#b94e24] px-[16px] py-[18px] text-white sm:px-[20px]">
          <div className="flex items-center gap-[13px]">
            {/* Avatar */}
            <div className="flex h-[51px] w-[51px] shrink-0 items-center justify-center rounded-[12px] bg-white/20 text-[17px] font-bold">
              {initials}
            </div>

            {/* User Info */}
            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-bold">{currentName}</h2>

              <p className="mt-[2px] text-[10px] text-orange-100">{roleText}</p>

              <div className="mt-[6px] flex flex-wrap items-center gap-[6px]">
                {/* Verified */}
                <span className="rounded-full bg-white/20 px-[8px] py-[3px] text-[8px] font-medium">
                  ✓ Verified
                </span>

                {/* Orders */}
                <span className="text-[8px] text-orange-100">
                  {completedOrders} completed orders
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            PERSONAL INFORMATION
        ========================================== */}

        <section className="mt-[16px] rounded-[15px] border border-[#e6ddd5] bg-white p-[16px] sm:p-[17px]">
          <h2 className="text-[11px] font-semibold text-[#171717]">
            Personal Information
          </h2>

          <form onSubmit={handleSave}>
            {/* Full Name */}
            <div className="mt-[15px]">
              <label className="mb-[6px] block text-[10px] font-medium text-[#171717]">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="h-[38px] w-full rounded-[10px] border border-[#dfd3c9] bg-white px-[12px] text-[11px] text-[#292421] outline-none transition focus:border-[#cf612e] focus:ring-1 focus:ring-[#cf612e]"
              />
            </div>

            {/* Email */}
            <div className="mt-[13px]">
              <label className="mb-[6px] block text-[10px] font-medium text-[#171717]">
                Email Address
              </label>

              <input
                type="email"
                value={formData.email}
                disabled
                className="h-[38px] w-full cursor-not-allowed rounded-[10px] border border-[#dfd3c9] bg-[#faf7f2] px-[12px] text-[11px] text-[#766b64]"
              />
            </div>

            {/* Phone */}
            <div className="mt-[13px]">
              <label className="mb-[6px] block text-[10px] font-medium text-[#171717]">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="h-[38px] w-full rounded-[10px] border border-[#dfd3c9] bg-white px-[12px] text-[11px] text-[#292421] outline-none transition placeholder:text-[#b4a9a1] focus:border-[#cf612e] focus:ring-1 focus:ring-[#cf612e]"
              />
            </div>

            {/* Message */}
            {message && (
              <p className="mt-[9px] text-[10px] font-medium text-[#00a63c]">
                {message}
              </p>
            )}

            {error && (
              <p className="mt-[9px] text-[10px] font-medium text-red-500">
                {error}
              </p>
            )}

            {/* Save */}
            <button
              type="submit"
              disabled={saving}
              className="mt-[13px] h-[34px] w-full rounded-[9px] bg-[#d15d2c] text-[10px] font-semibold text-white shadow-sm transition hover:bg-[#bd5125] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>

        {/* ==========================================
            PROFILE OPTIONS
        ========================================== */}

        <section className="mt-[16px] overflow-hidden rounded-[15px] border border-[#e6ddd5] bg-white">
          {/* Order History */}
          <button
            onClick={() => navigate("/user/order-history")}
            className="flex h-[45px] w-full items-center border-b border-[#eee6df] px-[16px] text-left transition hover:bg-[#faf7f2]"
          >
            <span className="w-[29px] text-[13px]">📋</span>

            <span className="flex-1 text-[11px] text-[#292421]">
              Order History
            </span>

            <span className="mr-[9px] flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-[#f5e9df] px-[5px] text-[9px] font-medium text-[#cf612e]">
              {completedOrders}
            </span>

            <span className="text-[13px] text-[#a99b92]">›</span>
          </button>

          {/* Favourites */}
          <button
            onClick={() => navigate("/user/favourites")}
            className="flex h-[45px] w-full items-center border-b border-[#eee6df] px-[16px] text-left transition hover:bg-[#faf7f2]"
          >
            <span className="w-[29px] text-[13px]">💜</span>

            <span className="flex-1 text-[11px] text-[#292421]">
              My Favourites
            </span>

            <span className="text-[13px] text-[#a99b92]">›</span>
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="flex h-[45px] w-full items-center border-b border-[#eee6df] px-[16px] text-left transition hover:bg-[#faf7f2]"
          >
            <span className="w-[29px] text-[13px]">🔔</span>

            <span className="flex-1 text-[11px] text-[#292421]">
              Notifications
            </span>

            <span className="mr-[9px] flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-[#f5e9df] px-[5px] text-[9px] font-medium text-[#cf612e]">
              0
            </span>

            <span className="text-[13px] text-[#a99b92]">›</span>
          </button>

          {/* Change Password */}
          <button
            onClick={() => navigate("/resetPass")}
            className="flex h-[45px] w-full items-center border-b border-[#eee6df] px-[16px] text-left transition hover:bg-[#faf7f2]"
          >
            <span className="w-[29px] text-[13px]">🔒</span>

            <span className="flex-1 text-[11px] text-[#292421]">
              Change Password
            </span>

            <span className="text-[13px] text-[#a99b92]">›</span>
          </button>

          {/* Help & Support */}
          <button
            type="button"
            className="flex h-[45px] w-full items-center border-b border-[#eee6df] px-[16px] text-left transition hover:bg-[#faf7f2]"
          >
            <span className="w-[29px] text-[13px]">❓</span>

            <span className="flex-1 text-[11px] text-[#292421]">
              Help & Support
            </span>

            <span className="text-[13px] text-[#a99b92]">›</span>
          </button>

          {/* Sign Out */}
          <button
            onClick={handleLogout}
            className="flex h-[45px] w-full items-center px-[16px] text-left transition hover:bg-[#fff4ef]"
          >
            <span className="w-[29px] text-[13px] text-[#ff4b4b]">⇥</span>

            <span className="text-[11px] font-medium text-[#ff4b4b]">
              Sign Out
            </span>
          </button>
        </section>
      </main>
    </div>
  );
};

export default UserProfile;
