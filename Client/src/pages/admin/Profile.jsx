import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "../../components/admin/AdminLayout";
import uploadImage from "../../services/Cloudinary";
import { getAdminProfile, saveAdminProfile } from "../../services/userService";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    imageUrl: "",
  });

  const [profileImage, setProfileImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const adminProfile = await getAdminProfile();

        if (adminProfile) {
          setProfile({
            name: adminProfile.name || "",
            email: adminProfile.email || "",
            phone: adminProfile.phone || "",
            imageUrl: adminProfile.imageUrl || "",
          });

          setProfileImage(adminProfile.imageUrl || null);
        }
      } catch (error) {
        console.error("Load Admin Profile Error:", error);
        alert("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setProfile((previousProfile) => ({
      ...previousProfile,
      [name]: value,
    }));
  };

  const handleChangePhoto = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setProfileImage(imageUrl);

    setProfile((previousProfile) => ({
      ...previousProfile,
      imageFile: file,
    }));
  };

  const handleSaveChanges = async () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      alert("Name and email are required.");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = profile.imageUrl;

      if (profile.imageFile) {
        imageUrl = await uploadImage(profile.imageFile);
      }

      const updatedProfile = {
        name: profile.name.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
        imageUrl,
      };

      await saveAdminProfile(updatedProfile);

      setProfile({
        ...updatedProfile,
        imageFile: null,
      });

      setProfileImage(imageUrl || null);

      alert("Profile saved successfully.");
    } catch (error) {
      console.error("Save Admin Profile Error:", error);
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    navigate("/");
  };

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";

  return (
    <AdminLayout>
      <>
        <div className="min-h-screen bg-[#f9f6f1] px-4 py-5 sm:px-6 lg:px-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold text-[#171717]">
              Admin Profile
            </h1>

            <p className="mt-1 text-sm text-[#a17d6c]">
              Manage your profile information
            </p>
          </div>

          {/* Profile Header */}
          <div className="mt-6 rounded-2xl border border-[#eadfd6] bg-[#241f1b] p-5 text-white sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              {/* Profile Information */}
              <div className="flex items-center gap-4">
                {/* Profile Image */}
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#d15d2c]">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl font-semibold">
                      {initials}
                    </div>
                  )}
                </div>

                {/* Profile Name */}
                <div>
                  <h2 className="text-lg font-semibold">
                    {loading ? "Loading..." : profile.name || "Admin"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    Canteen Owner · Administrator
                  </p>

                  <span className="mt-2 inline-flex rounded-full bg-[#d15d2c] px-3 py-1 text-xs font-medium text-white">
                    Admin
                  </span>
                </div>
              </div>

              {/* Change Photo */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleChangePhoto}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#3b332e] transition-colors hover:bg-[#f5eee8]"
                >
                  <span>📷</span>
                  Change Photo
                </button>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mt-6 max-w-3xl rounded-2xl border border-[#eadfd6] bg-white p-5 sm:p-6">
            <h2 className="text-base font-semibold text-[#171717]">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-[#9a8174]">
              Update your account information
            </p>

            {/* Full Name */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-[#3d332e]">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                disabled={loading || saving}
                className="h-11 w-full rounded-xl border border-[#e2d5ca] bg-white px-4 text-sm text-[#333] outline-none transition-colors focus:border-[#d15d2c] disabled:bg-[#f7f3ef]"
              />
            </div>

            {/* Email */}
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-[#3d332e]">
                Admin Email
              </label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                disabled={loading || saving}
                className="h-11 w-full rounded-xl border border-[#e2d5ca] bg-white px-4 text-sm text-[#333] outline-none transition-colors focus:border-[#d15d2c] disabled:bg-[#f7f3ef]"
              />
            </div>

            {/* Phone */}
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-[#3d332e]">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                disabled={loading || saving}
                className="h-11 w-full rounded-xl border border-[#e2d5ca] bg-white px-4 text-sm text-[#333] outline-none transition-colors focus:border-[#d15d2c] disabled:bg-[#f7f3ef]"
              />
            </div>

            {/* Save Changes */}
            <button
              onClick={handleSaveChanges}
              disabled={loading || saving}
              className="mt-6 h-11 w-full rounded-xl bg-[#d15d2c] text-sm font-semibold text-white transition-colors hover:bg-[#b94f25] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Sign Out */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#ffd1d1] bg-white px-6 py-3 text-sm font-medium text-[#ef5350] transition-colors hover:bg-[#fff5f5]"
            >
              <span>↪</span>
              Sign Out
            </button>
          </div>
        </div>
      </>
    </AdminLayout>
  );
};

export default Profile;
