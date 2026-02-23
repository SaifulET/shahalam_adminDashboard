import React, { useState } from 'react';
import { Eye, EyeOff, Upload } from 'lucide-react';

import { message } from "antd";
import api from '../../../lib/api';
import { useNavigate } from 'react-router-dom';

export default function AddAdmin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    profileImage: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFormData(prev => ({
  //       ...prev,
  //       profileImage: file // send file if backend supports multipart
  //     }));
  //   }
  // };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        role: "admin"
      };

       await api.post("/auth/signup", payload);

      message.success("Admin created successfully");

     

      // reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        profileImage: null
      });

    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
      navigate("/admin/admin");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        
        <div className="bg-blue-500 px-6 py-4">
          <h1 className="text-white text-2xl font-semibold">Admin Management</h1>
        </div>

        <div className="p-6 space-y-5">
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md pr-10 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-md transition duration-200 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Add"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
