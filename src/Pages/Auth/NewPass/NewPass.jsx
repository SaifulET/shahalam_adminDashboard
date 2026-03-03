import { Form, Input, Typography, message } from "antd";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import brandlogo from "../../../assets/image/logo.svg";
 // Adjust the path as needed
import api from "../../../lib/api"; // Adjust the path as needed
import { useAuthStore } from "../../../store/authStore";
import { useI18n } from "../../../i18n/I18nProvider";
const NewPass = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Get email from Zustand store
  const email = useAuthStore((state) => state.email);
  const clearEmail = useAuthStore((state) => state.clearEmail);

  // Redirect if no email is found in store


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onFinish = async (values) => {
    // Check if email exists
    if (!email) {
      message.error(t("auth.newPassword.emailNotFound"));
      navigate("/forgate-password");
      return;
    }

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
      
      // Redirect to sign-in page after 1 second
      setTimeout(() => {
        navigate("/sign-in");
      }, 1000);
      
    } catch (error) {
      // Handle error response
      const errorMessage = error.response?.data?.message || t("auth.newPassword.updateFailed");
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // If no email, show loading or redirect (handled by useEffect)
  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f9fafb]">
        <div className="text-center p-8 bg-white rounded-2xl">
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
                <img src={brandlogo} alt="brandlogo" className="w-40 h-40 my-3" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-gray-700 md:text-3xl">
                {t("auth.newPassword.title")}
              </h2>
              <Typography.Text className="text-base text-gray-600">
                {t("auth.newPassword.description", { email })}
              </Typography.Text>
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

            {/* Hidden email field for debugging if needed */}
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

            {/* Back to sign in link */}
            <div className="text-center mt-4">
              <Link to="/sign-in" className="text-[#71ABE0] hover:underline">
                {t("auth.newPassword.backToSignIn")}
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default NewPass;
