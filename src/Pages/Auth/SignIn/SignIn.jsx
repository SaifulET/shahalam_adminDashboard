import { Checkbox, Form, Input, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import brandlogo from "../../../assets/image/logo.svg";
import { useAuthStore } from "../../../store/authStore";
import api from "../../../lib/api";

const SignIn = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
console.log("Login values:", values);
      const response = await api.post("/auth/login-company", {
        email: values.email,
        password: values.password,
        role: "user", // remove if backend doesn't require it
      });
console.log("Login response:", response.data);
      const { user, accessToken } = response.data;

      // Save in Zustand
      login(user, accessToken);

      message.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      message.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f9fafb] min-h-screen flex items-center justify-center">
      <Form
        name="login"
        layout="vertical"
        onFinish={onFinish}
        className="px-10 py-12 rounded-2xl w-[580px] bg-white border-2 border-[#eef6ff]"
      >
        <div className="flex justify-center mb-4">
          <img src={brandlogo} className="w-32 h-32" alt="brandlogo" />
        </div>

        <div className="text-center mb-6">
          <Typography.Text className="text-base text-black">
            Please enter your email and password to continue
          </Typography.Text>
        </div>

        {/* Email */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input placeholder="Your Email" />
        </Form.Item>

        {/* Password */}
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Password is required" }]}
        >
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-2 text-gray-500"
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
        </Form.Item>

        <div className="flex items-center justify-between mb-4">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember Password</Checkbox>
          </Form.Item>

          <Link to="/forgate-password" className="text-red-600">
            Forget Password
          </Link>
        </div>

        <Form.Item>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#0088FF] w-full font-semibold text-white py-3 rounded-md"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignIn;
