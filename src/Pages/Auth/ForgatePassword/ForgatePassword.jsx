import React, { useState } from "react";
import { Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import brandlogo from "../../../assets/image/logo.svg";
import { useAuthStore } from "../../../store/authStore";
import api from "../../../lib/api";
import { useI18n } from "../../../i18n/I18nProvider";


const ForgatePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  const setStoredEmail = useAuthStore((state) => state.setEmail); // store email globally

  const onFinish = async (values) => {
    const { email } = values;
    if (!email) return;

    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });

      if (response.status === 200) {
        message.success(t("auth.forgot.resetSent"));
        setStoredEmail(email); // save email in auth store
        navigate("/verify-code");
      } else {
        message.error(response.data?.message || t("auth.forgot.resetFailed"));
      }
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || t("auth.forgot.somethingWrong"));
    } finally {
      setLoading(false);
      setStoredEmail(email);
       navigate("/verify-code"); // Ensure email is stored even if there's an error, for retry purposes
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f9fafb]">
      <div className="py-10 md:py-12 mx-2 md:mx-0 px-6 md:px-10 rounded-2xl w-[580px] h-[525px] bg-white border-2 border-[#eef6ff] mt-10">
        <div className="flex justify-center">
          <img className="w-40 h-40" src={brandlogo} alt="brandlogo" />
        </div>
        <h1 className="my-2 font-bold">{t("auth.forgot.title")}</h1>
        <p className="mb-4 text-gray-600">
          {t("auth.forgot.description")}
        </p>

        <Form name="forgotPassword" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: t("auth.forgot.emailRequired") },
              { type: "email", message: t("auth.forgot.emailInvalid") },
            ]}
          >
            <Input
              placeholder={t("auth.forgot.emailPlaceholder")}
              className="py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </Form.Item>

          <Form.Item>
            <div className="text-center">
              <button
                type="submit"
                className="bg-[#71ABE0] w-full text-white py-3 px-20 rounded-lg"
                disabled={loading}
              >
                {loading ? t("auth.forgot.sending") : t("auth.forgot.sendCode")}
              </button>
            </div>
          </Form.Item>

          <p className="text-center text-gray-600">
            {t("auth.forgot.rememberPassword")}{" "}
            <button
              type="button"
              className="hover:underline"
              onClick={() => navigate("/sign-in")}
            >
              {t("auth.forgot.signIn")}
            </button>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default ForgatePassword;
