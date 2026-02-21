import { Form, Input, Typography, message } from "antd";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";


import { useAuthStore } from "../../../store/authStore";
import api from "../../../lib/api";
 // Adjust the path as needed

const SetNewPass = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Get email from Zustand store
  const email = useAuthStore((state) => state.email);
  const clearEmail = useAuthStore((state) => state.clearEmail);

  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onFinish = async (values) => {
    // Check if email exists
   

    setLoading(true);
    const { newPassword, confirmPassword } = values;

    // Validate password match
    if (newPassword !== confirmPassword) {
      message.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    // Validate password strength (optional)
    if (newPassword.length < 8) {
      message.error("Password must be at least 8 characters long!");
      setLoading(false);
      return;
    }

    try {
      // API call to set new password
      await api.post("/auth/set-new-password", {
        email: email,
        newPassword: newPassword
      });

      // Clear email from store after successful password reset
      clearEmail();
      
      message.success("Password changed successfully");
      
      
      
    } catch (error) {
      // Handle error response
      const errorMessage = error.response?.data?.message || "Failed to update password. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
      navigate("/settings");
    }
  };

  // If no email, show loading or redirect (handled by useEffect)
  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f9fafb]">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to forgot password...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f9fafb]">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center w-full gap-2 mx-auto md:max-w-screen-md">
          <Form
            name="new-password"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            className="w-full max-w-lg px-6 py-10 mt-10 bg-white md:py-20 md:px-10 rounded-2xl"
          >
            <div className="mx-auto ">
              <div className="flex justify-center "> 
               
              </div>
              <h2 className="mb-4 text-2xl font-bold text-gray-700 md:text-3xl">
                Set New Password
              </h2>
             
            </div>

            <Form.Item
              name="newPassword"
              label={<p className="text-md">New Password</p>}
              rules={[
                { required: true, message: "Please input your new password!" },
                { min: 8, message: "Password must be at least 8 characters!" }
              ]}
              hasFeedback
            >
              <div className="relative flex items-center">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="text-md"
                  disabled={loading}
                />
                <div className="absolute right-0 pr-3">
                  <button 
                    type="button" 
                    onClick={togglePasswordVisibility}
                    className="focus:outline-none"
                    disabled={loading}
                  >
                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                  </button>
                </div>
              </div>
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<p className="text-md">Confirm Password</p>}
              dependencies={['newPassword']}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
              hasFeedback
            >
              <div className="relative flex items-center">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="text-md"
                  disabled={loading}
                />
                <div className="absolute right-0 pr-3">
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="focus:outline-none"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                  </button>
                </div>
              </div>
            </Form.Item>

            {/* Email display (hidden field) - optional, for debugging */}
            <Form.Item name="email" hidden initialValue={email}>
              <Input />
            </Form.Item>

            <Form.Item className="mt-8 text-center">
              <button
                className={`bg-[#71ABE0] text-center w-full p-2 font-semibold text-white px-20 py-3 rounded-md transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#5f9ac9]'
                }`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </Form.Item>

            {/* Back to login link (optional) */}
           
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SetNewPass;