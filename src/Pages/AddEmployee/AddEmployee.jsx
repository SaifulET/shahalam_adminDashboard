import React, { useState } from 'react';
import { Eye, EyeOff, Upload } from 'lucide-react';
// axios instance
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function AddEmployee() {
  const { user } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    profileImage: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file // store actual file
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Create FormData and append fields (same format as your example)
      const submitData = new FormData();
     
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('password', formData.password);
      submitData.append("userId", user?.id); // Append userId if needed by backend
      
      // Append image if it exists
      if (formData.profileImage) {
        submitData.append('image', formData.profileImage); // or 'profileImage' depending on your backend expectation
      }

      // Make the API call with multipart/form-data
      const res = await api.post('/employees/',submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Success:', res.data);
      alert('Employee added successfully!');

      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        profileImage: null
      });

      navigate('/employee'); // navigate to employee list after adding

    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert('Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 bg-gray-50 flex items-center justify-center">
      <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        
        <div className="bg-blue-500 px-6 py-4">
          <h1 className="text-white text-2xl font-semibold">Employee Management</h1>
        </div>

        <div className="px-6 space-y-5">

          <Input label="Name" name="name" value={formData.name} onChange={handleInputChange} />
          <Input label="Email" name="email" value={formData.email} onChange={handleInputChange} type="email" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border rounded-md pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Profile Image
            </label>
            <div className="border rounded-md p-8 bg-gray-50">
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label htmlFor="profileImage" className="flex flex-col items-center cursor-pointer">
                {formData.profileImage ? (
                  <img
                    src={URL.createObjectURL(formData.profileImage)}
                    alt="preview"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-gray-500 text-sm">Upload Image</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>

        </div>
      </div>
    </div>
  );
}

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-2.5 border rounded-md"
    />
  </div>
);