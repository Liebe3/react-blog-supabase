import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginThunk } from "../../thunks/authThunks";

import { ShowError, ShowSucess } from "../../utils/alert";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const resultAction = await dispatch(
        loginThunk({ email: email.trim().toLowerCase(), password })
      );

      if (loginThunk.fulfilled.match(resultAction)) {
        ShowSucess("Login successfull");
        navigate("/");
      }

      if (loginThunk.rejected.match(resultAction)) {
        ShowError(resultAction.payload || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      ShowError("An error occured during login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0d1117] dark:text-[#f0f6fc] px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-[#161b22] shadow-xl rounded-2xl p-8">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-emerald-600">Login</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              value={email}
              type="email"
              placeholder="john@example.com"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-600 dark:text-gray-400 cursor-pointer"
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl font-medium transition cursor-pointer"
          >
            Login
          </button>
        </form>

        {/* Sign up link */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="text-emerald-600 underline hover:text-emerald-500"
          >
            Sign up
          </Link>
        </div>

        {/* Social login */}
        <div className="mt-6">
          <div className="relative flex items-center justify-center mb-6">
            <div className="grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-[#161b22]">
              or sign in with
            </span>
            <div className="grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          <div className="flex justify-center space-x-4">
            <button className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#0d1117] transition duration-200 cursor-pointer">
              <FaFacebook className="text-xl text-blue-600" />
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#0d1117] transition duration-200 cursor-pointer">
              <FcGoogle className="text-xl" />
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#0d1117] transition duration-200 cursor-pointer">
              <FaGithub className="text-xl text-gray-900 dark:text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
