import { Checkbox, Form, Input, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import brandlogo from "../../../../assets/image/logo.svg";
import api from "../../../../lib/api"
import { useAuthStore } from "../../../../store/authStore";
const AdminSignIn = () => {
  const navigate = useNavigate();
  const [showpassword, setShowpassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const togglePasswordVisibility = () => {
    setShowpassword(!showpassword);
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const payload = {
        email: values.email,
        password: values.password,
        role: "superadmin",
      };

      const res = await api.post("/auth/superadmin-login", payload);
      const { accessToken, user } = res.data;

      login(user, accessToken);


      message.success("Login successful!");

      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f9fafb]">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-between w-full gap-2 mx-auto md:max-w-screen-md md:flex-row md:gap-20">
          <div className="md:h-[100vh] w-full flex items-center justify-center">
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
              className="py-5 md:py-12 mx-2 md:mx-0 px-6 md:px-10 rounded-2xl w-[580px] h-[525px] bg-white border-2 border-[#eef6ff]"
            >
              <div className="flex justify-center">
                <img src={brandlogo} className="w-40 h-40" alt="brandlogo" />
              </div>

              <div className="text-center">
                <Typography.Text className="text-base text-center text-black">
                  Please enter your email and password to continue
                </Typography.Text>
              </div>

              <Form.Item
                name="email"
                label={<p className="text-md">Email</p>}
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input className="text-md" placeholder="Your Email" />
              </Form.Item>

              <Form.Item
                name="password"
                label={<p className="text-md">Password</p>}
                rules={[{ required: true, message: "Password is required" }]}
              >
                <div className="relative flex items-center justify-center">
                  <Input
                    className="text-md"
                    type={showpassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  <div className="absolute right-0 flex justify-center px-3">
                    <button onClick={togglePasswordVisibility} type="button">
                      {showpassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </button>
                  </div>
                </div>
              </Form.Item>

              <div className="flex items-center justify-between my-2">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-black text-md">
                    Remember Password
                  </Checkbox>
                </Form.Item>
                <Link to="/admin/forgate-password">
                  <p className="text-red-600 text-md">Forget Password</p>
                </Link>
              </div>

              <Form.Item className="my-5 text-center">
                <button
                  className="bg-[#0088FF] text-center w-full p-2 font-semibold text-white px-20 py-3 rounded-md"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;