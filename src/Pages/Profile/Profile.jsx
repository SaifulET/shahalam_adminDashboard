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
    profileImage  : "",
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
console.log("formData:", formData);
  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
     
      if (!user) return;
      try {
        const res = await api.get(`/auth/${user.id}`);
        console.log("Profile data:", res.data, res.data.data.name);

        setFormData({
          name: res.data.data.name || "",
          tagline: res.data.data.tagline || "",
          description: res.data.data.description || "",
          location: res.data.data.location || "",
          city: res.data.data.city || "",
          country: res.data.data.country || "",
          postalCode: res.data.data.postalCode || "",
          phone: res.data.data.phone || "",
          email: res.data.data.email || "",
          website: res.data.data.website || "",
          instagramLink: res.data.data.instagramLink || "",
          profileImage: res.data.data.profileImage || "",
        });

        if (res.data.data.profileImage) setLogoPreview(res.data.data.profileImage );
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        message.error("Failed to load profile data");
      }
    };
    fetchProfile();
  }, [user, accessToken]);

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Logo upload handler
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFormData((prev) => ({ ...prev, logo: reader.result })); // Include logo in formData
      };
      reader.readAsDataURL(file);
    }
  };

  // Save changes
  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.patch(`/auth/${user.id}`, formData);
      message.success("Profile updated successfully");

      setFormData({
        name: res.data.data.name || "",
        tagline: res.data.data.tagline || "",
        description: res.data.data.description || "",
        location: res.data.data.location || "",
        city: res.data.data.city || "",
        country: res.data.data.country || "",
        postalCode: res.data.data.postalCode || "",
        phone: res.data.data.phone || "",
        email: res.data.data.email || "",
        website: res.data.data.website || "",
        instagramLink: res.data.data.instagramLink || "",
        profileImage: res.data.data.profileImage || "",
      });

      if (res.data.data.profileImage) setLogoPreview(res.data.data.profileImage );
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

      setFormData({
        name: res.data.data.name || "",
        tagline: res.data.data.tagline || "",
        description: res.data.data.description || "",
        location: res.data.data.location || "",
        city: res.data.data.city || "",
        country: res.data.data.country || "",
        postalCode: res.data.data.postalCode || "",
        phone: res.data.data.phone || "",
        email: res.data.data.email || "",
        website: res.data.data.website || "",
        instagramLink: res.data.data.instagramLink || "",
        profileImage: res.data.data.profileImage      || "",
      });

      if (res.data.data.profileImage) setLogoPreview(res.data.data.profileImage);
    } catch (err) {
      console.error("Failed to reset profile:", err);
      message.error("Failed to reset profile");
    }
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
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Company Info */}
            <div className="flex gap-6">
              {/* Logo */}
              <div className="flex-shrink-0">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200 hover:border-blue-400 transition-colors">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Company Logo"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="mx-auto text-gray-400 mb-1" size={24} />
                        <span className="text-xs text-gray-500">Upload</span>
                      </div>
                    )}
                  </div>
                </label>
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
                    <option value="IN">Saudi Arabia</option>
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
                    placeholder="https://www.company.com"
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
