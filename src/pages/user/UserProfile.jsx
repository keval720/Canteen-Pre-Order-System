import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrderContext";
import { logoutUser } from "../../services/authService";
import {
  subscribeToUserProfile,
  updateUserProfile,
} from "../../services/userService";

const UserProfile = () => {
  const navigate = useNavigate();

  const { user, profile, loading: authLoading } = useAuth();
  const { orders } = useOrders();

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
    if (!user) {
      setCompletedOrders(0);
      return;
    }

    const userCompletedOrders = orders.filter(
      (order) => order.userId === user.uid && order.status === "Delivered",
    );

    setCompletedOrders(userCompletedOrders.length);
  }, [orders, user]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setFormData({
        name: "",
        email: "",
        phone: "",
      });

      return;
    }

    setError("");

    const unsubscribe = subscribeToUserProfile(
      user.uid,
      (userProfile) => {
        if (userProfile) {
          setFormData({
            name: userProfile.name || "",
            email: userProfile.email || user.email || "",
            phone: userProfile.phone || "",
          });
        } else {
          setFormData({
            name: user.displayName || "",
            email: user.email || "",
            phone: "",
          });
        }
      },
      (error) => {
        console.error("User Profile Listener Error:", error);

        setError("Unable to load your profile.");
      },
    );

    return () => {
      unsubscribe();
    };
  }, [user, authLoading]);

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
      <main className="mx-auto w-full max-w-[1050px] px-4 pb-[60px] pt-[76px] sm:px-6 sm:pt-[78px] lg:px-0 lg:pt-[80px]">
        {/* ==========================================
            HEADING
        ========================================== */}

        <h1 className="font-serif text-[24px] text-[#171717] sm:text-[27px] lg:text-[29px]">
          My Profile
        </h1>

        {/* ==========================================
            PROFILE HEADER
        ========================================== */}

        <section className="mt-[16px] rounded-[15px] bg-gradient-to-r from-[#ce5b2b] to-[#b94e24] px-[16px] py-[18px] text-white sm:px-[20px] sm:py-[19px] lg:px-[22px]">
          <div className="flex items-center gap-[13px] sm:gap-[15px]">
            {/* Avatar */}
            <div className="flex h-[51px] w-[51px] shrink-0 items-center justify-center rounded-[12px] bg-white/20 text-[17px] font-bold sm:h-[55px] sm:w-[55px] sm:text-[18px] lg:h-[58px] lg:w-[58px] lg:text-[19px]">
              {initials}
            </div>

            {/* User Info */}
            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-bold sm:text-[17px] lg:text-[18px]">
                {currentName}
              </h2>

              <p className="mt-[2px] text-[10px] text-orange-100 sm:text-[11px] lg:text-[12px]">
                {roleText}
              </p>

              <div className="mt-[6px] flex flex-wrap items-center gap-[6px] sm:gap-[8px]">
                {/* Verified */}
                <span className="rounded-full bg-white/20 px-[8px] py-[3px] text-[8px] font-medium sm:px-[9px] sm:py-[3px] sm:text-[9px] lg:text-[10px]">
                  ✓ Verified
                </span>

                {/* Orders */}
                <span className="text-[8px] text-orange-100 sm:text-[9px] lg:text-[10px]">
                  {completedOrders} completed orders
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            PROFILE CONTENT
        ========================================== */}

        <div className="mt-[16px] flex flex-col gap-[16px] sm:flex-row sm:items-start sm:gap-[16px] lg:gap-[18px]">
          {/* ==========================================
              PERSONAL INFORMATION
          ========================================== */}

          <section className="w-full rounded-[15px] border border-[#e6ddd5] bg-white p-[16px] sm:w-1/2 sm:p-[17px] lg:p-[18px]">
            <h2 className="text-[12px] font-semibold text-[#171717] sm:text-[13px] lg:text-[14px]">
              Personal Information
            </h2>

            <form onSubmit={handleSave}>
              {/* Full Name */}
              <div className="mt-[15px]">
                <label className="mb-[6px] block text-[10px] font-medium text-[#171717] sm:text-[11px] lg:text-[12px]">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-[38px] w-full rounded-[10px] border border-[#dfd3c9] bg-white px-[12px] text-[12px] text-[#292421] outline-none transition focus:border-[#cf612e] focus:ring-1 focus:ring-[#cf612e] sm:h-[40px] sm:text-[13px] lg:h-[42px] lg:text-[14px]"
                />
              </div>

              {/* Email */}
              <div className="mt-[13px]">
                <label className="mb-[6px] block text-[10px] font-medium text-[#171717] sm:text-[11px] lg:text-[12px]">
                  Email Address
                </label>

                <input
                  type="email"
                  value={currentEmail}
                  disabled
                  className="h-[38px] w-full cursor-not-allowed rounded-[10px] border border-[#dfd3c9] bg-[#faf7f2] px-[12px] text-[12px] text-[#766b64] sm:h-[40px] sm:text-[13px] lg:h-[42px] lg:text-[14px]"
                />
              </div>

              {/* Phone */}
              <div className="mt-[13px]">
                <label className="mb-[6px] block text-[10px] font-medium text-[#171717] sm:text-[11px] lg:text-[12px]">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="h-[38px] w-full rounded-[10px] border border-[#dfd3c9] bg-white px-[12px] text-[12px] text-[#292421] outline-none transition placeholder:text-[#b4a9a1] focus:border-[#cf612e] focus:ring-1 focus:ring-[#cf612e] sm:h-[40px] sm:text-[13px] lg:h-[42px] lg:text-[14px]"
                />
              </div>

              {/* Message */}
              {message && (
                <p className="mt-[9px] text-[10px] font-medium text-[#00a63c] sm:text-[11px] lg:text-[12px]">
                  {message}
                </p>
              )}

              {/* Error */}
              {error && (
                <p className="mt-[9px] text-[10px] font-medium text-red-500 sm:text-[11px] lg:text-[12px]">
                  {error}
                </p>
              )}

              {/* Save */}
              <button
                type="submit"
                disabled={saving}
                className="mt-[13px] h-[34px] w-full rounded-[9px] bg-[#d15d2c] text-[10px] font-semibold text-white shadow-sm transition hover:bg-[#bd5125] disabled:cursor-not-allowed disabled:opacity-60 sm:h-[36px] sm:text-[11px] lg:h-[38px] lg:text-[12px]"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </section>

          {/* ==========================================
              PROFILE OPTIONS
          ========================================== */}

          <section className="w-full self-start overflow-hidden rounded-[15px] border border-[#e6ddd5] bg-white sm:w-1/2">
            {/* Order History */}
            <button
              onClick={() => navigate("/user/order-history")}
              className="flex h-[45px] w-full items-center border-b border-[#eee6df] px-[16px] text-left transition hover:bg-[#faf7f2] sm:h-[49px] sm:px-[17px] lg:h-[52px] lg:px-[18px]"
            >
              <span className="w-[29px] text-[13px] sm:w-[31px] sm:text-[14px] lg:text-[15px]">
                📋
              </span>

              <span className="flex-1 text-[11px] text-[#292421] sm:text-[12px] lg:text-[14px]">
                Order History
              </span>

              <span className="mr-[9px] flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-[#f5e9df] px-[5px] text-[9px] font-medium text-[#cf612e] sm:h-[20px] sm:min-w-[20px] sm:text-[10px] lg:h-[21px] lg:min-w-[21px] lg:text-[11px]">
                {completedOrders}
              </span>

              <span className="text-[13px] text-[#a99b92] sm:text-[14px] lg:text-[15px]">
                ›
              </span>
            </button>

            {/* Favourites */}
            <button
              onClick={() => navigate("/user/favourites")}
              className="flex h-[45px] w-full items-center border-b border-[#eee6df] px-[16px] text-left transition hover:bg-[#faf7f2] sm:h-[49px] sm:px-[17px] lg:h-[52px] lg:px-[18px]"
            >
              <span className="w-[29px] text-[13px] sm:w-[31px] sm:text-[14px] lg:text-[15px]">
                💜
              </span>

              <span className="flex-1 text-[11px] text-[#292421] sm:text-[12px] lg:text-[14px]">
                My Favourites
              </span>

              <span className="text-[13px] text-[#a99b92] sm:text-[14px] lg:text-[15px]">
                ›
              </span>
            </button>

            {/* Change Password */}
            <button
              onClick={() => navigate("/resetPass")}
              className="flex h-[45px] w-full items-center border-b border-[#eee6df] px-[16px] text-left transition hover:bg-[#faf7f2] sm:h-[49px] sm:px-[17px] lg:h-[52px] lg:px-[18px]"
            >
              <span className="w-[29px] text-[13px] sm:w-[31px] sm:text-[14px] lg:text-[15px]">
                🔒
              </span>

              <span className="flex-1 text-[11px] text-[#292421] sm:text-[12px] lg:text-[14px]">
                Change Password
              </span>

              <span className="text-[13px] text-[#a99b92] sm:text-[14px] lg:text-[15px]">
                ›
              </span>
            </button>

            {/* Sign Out */}
            <button
              onClick={handleLogout}
              className="flex h-[45px] w-full items-center px-[16px] text-left transition hover:bg-[#fff4ef] sm:h-[49px] sm:px-[17px] lg:h-[52px] lg:px-[18px]"
            >
              <span className="w-[29px] text-[13px] text-[#ff4b4b] sm:w-[31px] sm:text-[14px] lg:text-[15px]">
                ⇥
              </span>

              <span className="text-[11px] font-medium text-[#ff4b4b] sm:text-[12px] lg:text-[14px]">
                Sign Out
              </span>
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
