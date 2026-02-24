"use client";

import { useState, useEffect } from "react";
import { Camera, Save, X } from "lucide-react";
import { message } from "antd";
import api from "../../lib/api";
import { useAuthStore } from "../../store/authStore";

export default function CompanyProfile() {
  const { user, accessToken } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    location: "",
    city: "",
    country: "",
    postalCode: "",
    phone: "",
    email: "",
    website: "",
    instagramLink: "",
    profileImage: "",
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const res = await api.get(`/auth/${user.id}`);
        console.log("Profile data:", res.data);

        const userData = res.data.data;
        
        setFormData({
          name: userData.name || "",
          tagline: userData.tagline || "",
          description: userData.description || "",
          location: userData.location || "",
          city: userData.city || "",
          country: userData.country || "",
          postalCode: userData.postalCode || "",
          phone: userData.phone || "",
          email: userData.email || "",
          website: userData.website || "",
          instagramLink: userData.instagramLink || "",
          profileImage: userData.profileImage || "",
        });

        // Set the preview from server data
        if (userData.profileImage) {
          setLogoPreview(userData.profileImage);
        }

        // update auth store
        login({
          id: userData._id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          profileImage: userData.profileImage,
        });

      } catch (err) {
        console.error("Failed to fetch profile:", err);
        message.error("Failed to load profile data");
      }
    };
    fetchProfile();
  }, [user, accessToken, login]);

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Logo upload handler - fixed for immediate preview
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      
      // Clean up previous blob URL if it exists
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
      
      // Create new preview
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      
      // Force a re-render by using a small timeout (optional, usually not needed)
      // This can help in some edge cases
      setTimeout(() => {
        setLogoPreview(prev => prev); // This is a trick to force re-render if needed
      }, 10);
    }
  };

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  // Save changes with FormData
  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('tagline', formData.tagline);
      submitData.append('description', formData.description);
      submitData.append('location', formData.location);
      submitData.append('city', formData.city);
      submitData.append('country', formData.country);
      submitData.append('postalCode', formData.postalCode);
      submitData.append('phone', formData.phone);
      submitData.append('email', formData.email);
      submitData.append('website', formData.website);
      submitData.append('instagramLink', formData.instagramLink);
      
      if (logoFile) {
        submitData.append('image', logoFile);
      }

      const res = await api.patch(`/auth/${user.id}`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      message.success("Profile updated successfully");

      // Clean up blob URL if it exists
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }

      // Update form with response data
      const updatedData = res.data.data;
      setFormData({
        name: updatedData.name || "",
        tagline: updatedData.tagline || "",
        description: updatedData.description || "",
        location: updatedData.location || "",
        city: updatedData.city || "",
        country: updatedData.country || "",
        postalCode: updatedData.postalCode || "",
        phone: updatedData.phone || "",
        email: updatedData.email || "",
        website: updatedData.website || "",
        instagramLink: updatedData.instagramLink || "",
        profileImage: updatedData.profileImage || "",
      });

      // Update preview with the server URL after successful upload
      if (updatedData.profileImage) {
        setLogoPreview(updatedData.profileImage);
      }
      
      setLogoFile(null); // Clear the file after successful upload

      // Update auth store with new data
      login({
        id: user._id,
        name: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone,
        profileImage: updatedData.profileImage,
      });

    } catch (err) {
      console.error("Failed to update profile:", err);
      message.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Cancel changes
  const handleCancel = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/auth/${user.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const userData = res.data.data;
      
      setFormData({
        name: userData.name || "",
        tagline: userData.tagline || "",
        description: userData.description || "",
        location: userData.location || "",
        city: userData.city || "",
        country: userData.country || "",
        postalCode: userData.postalCode || "",
        phone: userData.phone || "",
        email: userData.email || "",
        website: userData.website || "",
        instagramLink: userData.instagramLink || "",
        profileImage: userData.profileImage || "",
      });

      // Clean up blob URL if it exists
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }

      // Reset preview to server image
      if (userData.profileImage) {
        setLogoPreview(userData.profileImage);
      } else {
        setLogoPreview(null);
      }
      setLogoFile(null); // Clear any pending file upload
      
      message.success("Changes cancelled");
    } catch (err) {
      console.error("Failed to reset profile:", err);
      message.error("Failed to reset profile");
    }
  };

  // Image error handler
  const handleImageError = (e) => {
    console.log("Image failed to load:", e.target.src);
    e.target.style.display = 'none';
    e.target.nextSibling?.style?.setProperty('display', 'flex');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-16">
      <div className="rounded mx-auto max-w-6xl">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-semibold">Company Profile</h1>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-b-lg shadow-sm">
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 p-6 border-b">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <X size={18} /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Company Info */}
            <div className="flex gap-6">
              {/* Logo - Fixed preview section */}
              <div className="flex-shrink-0">
                <label className="cursor-pointer block relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    key={logoPreview} // This forces the input to re-render when preview changes
                  />
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200 hover:border-blue-400 transition-colors overflow-hidden relative">
                    {logoPreview ? (
                      <>
                        <img
                          src={logoPreview}
                          alt="Company Logo"
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                          <Camera className="text-white" size={24} />
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <Camera className="mx-auto text-gray-400 mb-1" size={24} />
                        <span className="text-xs text-gray-500">Upload</span>
                      </div>
                    )}
                  </div>
                </label>
                {logoFile && (
                  <p className="text-xs text-green-600 mt-1">
                    New image selected: {logoFile.name}
                  </p>
                )}
              </div>

              {/* Name & Tagline */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleInputChange}
                    placeholder="Brief company description or tagline"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* About Company */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                About Company
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide a detailed description of your company..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            {/* Address & Contact */}
            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-4">
                Address & Contact Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {/* Address Line */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select country</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                    <option value="SA">Saudi Arabia</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="Postal code"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="company@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.company.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Social Media */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Media
                  </label>
                  <input
                    type="url"
                    name="instagramLink"
                    value={formData.instagramLink}
                    onChange={handleInputChange}
                    placeholder="https://www.instagram.com/company"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}