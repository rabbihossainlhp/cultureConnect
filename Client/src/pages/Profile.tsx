import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { LogOut, MapPin, Mail, User, Edit2, X, Save, AlertCircle, Loader, CheckCircle, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { updateProfileApiHandler } from "../services/api.service";
import { motion, AnimatePresence } from "framer-motion";
import type { ToastState } from "../types/index";

export default function Profile() {
  const { user, logout, refreshAuth } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    country: user?.country || "",
    bio: "",
    nativeLanguage: "",
  });
  const [originalData, setOriginalData] = useState(formData);

  // Load saved profile data on mount
  useEffect(() => {
    if (user) {
      const profileData = {
        username: user.username || "",
        email: user.email || "",
        country: user.country || "",
        bio: user.bio || "",
        nativeLanguage: user.native_language || "",
      };
      setFormData(profileData);
      setOriginalData(profileData);
    }
  }, [user]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

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
    setError(null);
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicturePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    setError(null);
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Create FormData for multipart form submission
      const updateFormData = new FormData();

      // Add changed fields
      if (formData.nativeLanguage !== originalData.nativeLanguage && formData.nativeLanguage) {
        updateFormData.append('nativeLanguage', formData.nativeLanguage);
      }

      if (formData.bio !== originalData.bio && formData.bio.trim()) {
        updateFormData.append('bio', formData.bio);
      }

      // Add image file if selected (middleware expects 'image' field)
      if (profilePictureFile) {
        updateFormData.append('image', profilePictureFile);
      }

      // Check if there's anything to update
      if (updateFormData.entries().next().done) {
        setToast({ type: "error", message: "No changes made" });
        setIsLoading(false);
        return;
      }

      await updateProfileApiHandler(updateFormData);

      // Refresh auth to get updated profile picture and other data
      await refreshAuth();

      // Update original data after successful save
      setOriginalData(formData);
      setProfilePictureFile(null);
      setProfilePicturePreview(null);
      setIsEditing(false);
      setToast({ 
        type: "success", 
        message: "✅ Profile updated successfully!" 
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save profile";
      setToast({ 
        type: "error", 
        message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setProfilePictureFile(null);
    setProfilePicturePreview(null);
    setIsEditing(false);
    setError(null);
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
      {/* Toast Notification */}
      <div className="fixed right-4 top-4 z-50 w-[min(92vw,360px)]">
        <AnimatePresence>
          {toast && (
            <motion.div
              key="profile-toast"
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className={`rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md ${
                toast.type === "error"
                  ? "border-rose-300 bg-linear-to-r from-rose-50 to-orange-50 text-rose-800"
                  : "border-emerald-300 bg-linear-to-r from-emerald-50 to-lime-50 text-emerald-800"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {toast.type === "error" ? (
                    <AlertCircle className="h-5 w-5" />
                  ) : (
                    <CheckCircle className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    {toast.type === "error" ? "Error" : "Success"}
                  </p>
                  <p className="text-sm opacity-90">{toast.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setToast(null)}
                  className="rounded-md p-1 opacity-70 transition hover:opacity-100"
                  aria-label="Close notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-2xl mx-auto pt-20">
        {/* PROFILE CARD */}
        <div className="rounded-3xl border border-white/80 bg-white/90 overflow-hidden shadow-lg">
          {/* Header Background */}
          <div className="h-32 sm:h-40 bg-linear-to-r from-orange-400 to-pink-400"></div>

          {/* Profile Content */}
          <div className="px-6 sm:px-8 pb-8">
            {/* Avatar and Name */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 mb-8">
              <div className="w-32 h-32 rounded-2xl bg-linear-to-br from-orange-400 to-pink-400 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                {profilePicturePreview ? (
                  <img 
                    src={profilePicturePreview} 
                    alt={formData.username}
                    className="w-full h-full object-cover"
                  />
                ) : user?.profile_picture ? (
                  <img 
                    src={user.profile_picture} 
                    alt={formData.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
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
                {error && (
                  <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

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

                  {/* Profile Picture */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Profile Picture
                    </label>
                    <div className="flex flex-col gap-4">
                      {/* Preview */}
                      {profilePicturePreview && (
                        <div className="w-32 h-32 rounded-xl border-2 border-dashed border-orange-300 overflow-hidden bg-orange-50 flex items-center justify-center">
                          <img 
                            src={profilePicturePreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      {/* File Input */}
                      <label className="relative">
                        <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-orange-300 rounded-lg bg-orange-50/50 hover:bg-orange-100/50 cursor-pointer transition">
                          <Upload className="h-5 w-5 text-orange-600" />
                          <span className="text-sm text-orange-700 font-medium">
                            {profilePictureFile ? "Change image" : "Upload image"}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-slate-500">
                        Supported formats: JPG, PNG, WebP (Max 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="flex-1 btn bg-linear-to-r from-green-500 to-emerald-500 text-white border-none hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
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
                    disabled={isLoading}
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
