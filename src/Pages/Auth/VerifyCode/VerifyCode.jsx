import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import brandlogo from "../../../assets/image/logo.svg";
import api from "../../../lib/api";
import { useAuthStore } from "../../../store/authStore";
import { useI18n } from "../../../i18n/I18nProvider";

const VerifyCode = () => {
  const { t } = useI18n();
  const [code, setCode] = useState(["", "", "", ""]); // 4-digit code
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
 
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Get email from Zustand store
  const email = useAuthStore((state) => state.email);
  

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 4);
  }, []);

  // Timer for resend OTP


  // Redirect if no email in store
  useEffect(() => {
    if (!email) {
      setError(t("auth.verify.sessionExpired"));
      setTimeout(() => {
        navigate("/forgot-password");
      }, 2000);
    }
  }, [email, navigate, t]);

  const handleChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);
    setError(""); // Clear error when user types

    if (value && index < 3) { // Changed from 4 to 3 for 4-digit code
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError(t("auth.verify.emailMissing"));
      navigate("/forgot-password");
      return;
    }

   
    setError("");

    try {
      // API call to resend OTP
      await api.post("/auth/forgot-password", {
        email: email
      });

      // Clear code inputs
      setCode(["", "", "", ""]);
      
      // Focus first input
      inputRefs.current[0]?.focus();
      
    } catch (err) {
      setError(err.response?.data?.message || t("auth.verify.resendFailed"));
     
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    const verificationCode = code.join("");

    // Validate code
    if (verificationCode.length !== 4) {
      setError(t("auth.verify.codeIncomplete"));
      return;
    }

    // Check if email exists
    if (!email) {
      setError(t("auth.verify.emailMissingRestart"));
      setTimeout(() => {
        navigate("/forgot-password");
      }, 2000);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // API call to verify OTP
       await api.post("/auth/verify-otp", {
        email: email,
        otp: verificationCode
      });

      // Navigate to new password page on success
      navigate("/new-password");
      
    } catch (err) {
      setError(err.response?.data?.message || t("auth.verify.invalidCode"));
      
      // Clear code inputs on error
      setCode(["", "", "", ""]);
      
      // Focus first input
      inputRefs.current[0]?.focus();
      
    } finally {
      setLoading(false);
    }
  };

  // If no email, show loading or redirect (handled by useEffect)
  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f9fafb]">
        <div className="text-center p-8 bg-white rounded-2xl">
          <p className="text-gray-600">{error || t("auth.verify.redirecting")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f9fafb]">
      <div className="py-10 md:py-12 mx-2 md:mx-0 px-6 md:px-10 rounded-2xl w-[580px] bg-white border-2 border-[#eef6ff]">
        <div className="">
          <div className="flex justify-center">
            <img className="w-40 h-40" src={brandlogo} alt="brandlogo" />
          </div>
          <h1 className="text-2xl font-medium">{t("auth.verify.title")}</h1>
          <p className="mt-4">
            {t("auth.verify.description")}{" "}
            <span className="font-medium text-gray-700">{email}</span>
            <br />
            {t("auth.verify.descriptionSuffix")}
          </p>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="mt-6">
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  value={code[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-12 text-xl font-semibold text-center text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                    error && !code[index] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  maxLength={1}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  
                />
              ))}
            </div>
            
            <div className="flex items-center justify-between py-2">
              <p className="text-gray-500">{t("auth.verify.didNotReceive")}</p>
              <button
                type="button"
                onClick={handleResend}
                
                className={`text-sky-400 hover:text-sky-500 focus:outline-none`}
              >
              {t("auth.verify.resend")}
              </button>
            </div>

            <button
              type="submit"
              
              className={`py-3 px-20 w-full mt-8 text-white transition-colors rounded-md bg-[#71ABE0] focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 `}
            >
              {loading ? t("auth.verify.verifying") : t("auth.verify.submit")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
