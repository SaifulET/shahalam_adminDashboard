import { Form, Input, Typography, message } from "antd";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";


import { useAuthStore } from "../../../store/authStore";
import api from "../../../lib/api";
import { useI18n } from "../../../i18n/I18nProvider";
 // Adjust the path as needed

const SetNewPass = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
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
      message.error(t("auth.newPassword.passwordMismatch"));
      setLoading(false);
      return;
    }

    // Validate password strength (optional)
    if (newPassword.length < 8) {
      message.error(t("auth.newPassword.passwordMin"));
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
      
      message.success(t("auth.newPassword.passwordChanged"));
      
      
      
    } catch (error) {
      // Handle error response
      const errorMessage = error.response?.data?.message || t("auth.newPassword.updateFailed");
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
          <p className="text-gray-600">{t("auth.newPassword.redirecting")}</p>
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
                {t("settingsOtp.setNewPassword")}
              </h2>
             
            </div>

            <Form.Item
              name="newPassword"
              label={<p className="text-md">{t("auth.newPassword.newPassword")}</p>}
              rules={[
                { required: true, message: t("auth.newPassword.newPasswordRequired") },
                { min: 8, message: t("auth.newPassword.passwordMin") }
              ]}
              hasFeedback
            >
              <div className="relative flex items-center">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.newPassword.newPasswordPlaceholder")}
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
              label={<p className="text-md">{t("auth.newPassword.confirmPassword")}</p>}
              dependencies={['newPassword']}
              rules={[
                { required: true, message: t("auth.newPassword.confirmRequired") },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t("auth.newPassword.passwordMismatch")));
                  },
                }),
              ]}
              hasFeedback
            >
              <div className="relative flex items-center">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("auth.newPassword.confirmPasswordPlaceholder")}
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
                {loading ? t("auth.newPassword.updating") : t("auth.newPassword.submit")}
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
