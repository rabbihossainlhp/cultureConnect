import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { LogOut, MapPin, Mail, User, Edit2, X, Save, AlertCircle, Loader } from "lucide-react";
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URI || "http://localhost:4713/api";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    country: user?.country || "",
    bio: "",
    nativeLanguage: "",
  });

  // Load profile data from backend on mount
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setFormData({
          username: data.data.username || user?.username || "",
          email: data.data.email || user?.email || "",
          country: data.data.country || user?.country || "",
          bio: data.data.bio || "",
          nativeLanguage: data.data.native_language || "",
        });
      } else {
        setError("Failed to load profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login", { replace: true });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const updateData: any = {};

      // Only send changed fields
      if (formData.bio !== undefined) updateData.bio = formData.bio;
      if (formData.nativeLanguage !== undefined) updateData.nativeLanguage = formData.nativeLanguage;

      if (Object.keys(updateData).length === 0) {
        setError("No changes to save");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("✅ Profile saved successfully!");
        setIsEditing(false);
        // Refresh profile data from backend
        setTimeout(() => fetchProfile(), 500);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reload data from backend
    fetchProfile();
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-10 bg-linear-to-b from-orange-50 via-white to-pink-50">
      <div className="max-w-2xl mx-auto pt-20">
        {/* PROFILE CARD */}
        <div className="rounded-3xl border border-white/80 bg-white/90 overflow-hidden shadow-lg">
          {/* Header Background */}
          <div className="h-32 sm:h-40 bg-linear-to-r from-orange-400 to-pink-400"></div>

          {/* Profile Content */}
          <div className="px-6 sm:px-8 pb-8">
            {/* Avatar and Name */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 mb-8">
              <div className="w-32 h-32 rounded-2xl bg-linear-to-br from-orange-400 to-pink-400 flex items-center justify-center border-4 border-white shadow-lg">
                <User className="w-16 h-16 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">{formData.username}</h1>
                <p className="text-slate-600 mt-1">Member since Jan 2024</p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}

            {!isEditing ? (
              <>
                {/* Display Mode */}
                <div className="space-y-3 mb-8 pb-8 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-orange-500" />
                    <span className="text-slate-700">{formData.email}</span>
                  </div>
                  {formData.country && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-orange-500" />
                      <span className="text-slate-700">{formData.country}</span>
                    </div>
                  )}
                  {formData.bio && (
                    <div>
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">Bio:</span> {formData.bio}
                      </p>
                    </div>
                  )}
                  {formData.nativeLanguage && (
                    <div>
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">Native Language:</span> {formData.nativeLanguage}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 sm:grid-cols-3 mb-8">
                  <div className="rounded-lg bg-linear-to-br from-orange-50 to-pink-50 p-4 text-center">
                    <p className="text-2xl font-bold text-slate-800">8</p>
                    <p className="text-sm text-slate-600">Missions</p>
                  </div>
                  <div className="rounded-lg bg-linear-to-br from-orange-50 to-pink-50 p-4 text-center">
                    <p className="text-2xl font-bold text-slate-800">3</p>
                    <p className="text-sm text-slate-600">Languages</p>
                  </div>
                  <div className="rounded-lg bg-linear-to-br from-orange-50 to-pink-50 p-4 text-center">
                    <p className="text-2xl font-bold text-slate-800">42</p>
                    <p className="text-sm text-slate-600">Friends</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 btn bg-linear-to-r from-orange-500 to-pink-500 text-white border-none hover:shadow-lg"
                  >
                    <Edit2 className="h-5 w-5" />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 btn btn-outline border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Edit Mode */}
                <div className="space-y-5 mb-8">
                  {/* Username (Read-only) */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      disabled
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-500 mt-1">Username cannot be changed</p>
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Country (Read-only) */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      disabled
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-500 mt-1">Country cannot be changed</p>
                  </div>

                  {/* Native Language - EDITABLE */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Native Language
                    </label>
                    <select
                      name="nativeLanguage"
                      value={formData.nativeLanguage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500"
                    >
                      <option value="">Select your native language</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Mandarin">Mandarin Chinese</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Arabic">Arabic</option>
                      <option value="Portuguese">Portuguese</option>
                      <option value="Russian">Russian</option>
                      <option value="Korean">Korean</option>
                      <option value="Italian">Italian</option>
                    </select>
                  </div>

                  {/* Bio - EDITABLE */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      placeholder="Tell us about yourself..."
                      value={formData.bio}
                      onChange={handleInputChange}
                      maxLength={200}
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-1 text-right">
                      {formData.bio.length}/200
                    </p>
                  </div>
                </div>

                {/* Edit Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex-1 btn bg-linear-to-r from-green-500 to-emerald-500 text-white border-none hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 btn btn-outline border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="h-5 w-5" />
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-10 bg-linear-to-b from-orange-50 via-white to-pink-50">
      <div className="max-w-2xl mx-auto pt-20">
        {/* PROFILE CARD */}
        <div className="rounded-3xl border border-white/80 bg-white/90 overflow-hidden shadow-lg">
          {/* Header Background */}
          <div className="h-32 sm:h-40 bg-gradient-to-r from-orange-400 to-pink-400"></div>

          {/* Profile Content */}
          <div className="px-6 sm:px-8 pb-8">
            {/* Avatar and Name */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 mb-8">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center border-4 border-white shadow-lg">
                <User className="w-16 h-16 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">{formData.username}</h1>
                <p className="text-slate-600 mt-1">Member since Jan 2024</p>
              </div>
            </div>

            {!isEditing ? (
              <>
                {/* Display Mode */}
                <div className="space-y-3 mb-8 pb-8 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-orange-500" />
                    <span className="text-slate-700">{formData.email}</span>
                  </div>
                  {formData.country && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-orange-500" />
                      <span className="text-slate-700">{formData.country}</span>
                    </div>
                  )}
                  {formData.bio && (
                    <div>
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">Bio:</span> {formData.bio}
                      </p>
                    </div>
                  )}
                  {formData.nativeLanguage && (
                    <div>
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">Native Language:</span> {formData.nativeLanguage}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 sm:grid-cols-3 mb-8">
                  <div className="rounded-lg bg-gradient-to-br from-orange-50 to-pink-50 p-4 text-center">
                    <p className="text-2xl font-bold text-slate-800">8</p>
                    <p className="text-sm text-slate-600">Missions</p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-orange-50 to-pink-50 p-4 text-center">
                    <p className="text-2xl font-bold text-slate-800">3</p>
                    <p className="text-sm text-slate-600">Languages</p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-orange-50 to-pink-50 p-4 text-center">
                    <p className="text-2xl font-bold text-slate-800">42</p>
                    <p className="text-sm text-slate-600">Friends</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 btn bg-gradient-to-r from-orange-500 to-pink-500 text-white border-none hover:shadow-lg"
                  >
                    <Edit2 className="h-5 w-5" />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 btn btn-outline border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Edit Mode */}
                <div className="space-y-5 mb-8">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      placeholder="e.g., United States"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Native Language */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Native Language
                    </label>
                    <select
                      name="nativeLanguage"
                      value={formData.nativeLanguage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500"
                    >
                      <option value="">Select your native language</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Mandarin">Mandarin Chinese</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Arabic">Arabic</option>
                      <option value="Portuguese">Portuguese</option>
                      <option value="Russian">Russian</option>
                      <option value="Korean">Korean</option>
                      <option value="Italian">Italian</option>
                    </select>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      placeholder="Tell us about yourself..."
                      value={formData.bio}
                      onChange={handleInputChange}
                      maxLength={200}
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-1 text-right">
                      {formData.bio.length}/200
                    </p>
                  </div>
                </div>

                {/* Edit Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 btn bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none hover:shadow-lg"
                  >
                    <Save className="h-5 w-5" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 btn btn-outline border-slate-300 text-slate-600 hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
