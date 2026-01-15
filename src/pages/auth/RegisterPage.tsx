import { useState } from "react";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerThunk } from "../../thunks/authThunks";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

import { ShowError } from "../../utils/alert";

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      ShowError("Password do not match");
      return;
    }

    try {
      const resultAction = await dispatch(
        registerThunk({
          email: email.trim().toLocaleLowerCase(),
          password,
          confirmPassword,
          profile,
        })
      );

      if (registerThunk.fulfilled.match(resultAction)) {
        navigate("/auth/login");
      }
    } catch (error) {
      console.error(error);
      ShowError("An error occured during registration");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-emerald-600">
            Create an Account
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* first name */}
            <div>
              <label className="text-sm font-medium">First Name</label>
              <input
                type="text"
                name="first_name"
                value={profile.first_name}
                placeholder="John"
                onChange={(event) =>
                  setProfile({ ...profile, first_name: event.target.value })
                }
                required
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* last name */}
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={profile.last_name}
                placeholder="Doe"
                onChange={(event) =>
                  setProfile({ ...profile, last_name: event.target.value })
                }
                required
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="john@example.com"
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                placeholder="Enter password"
                onChange={(event) => setPassword(event.target.value)}
                required
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                placeholder="Confirm password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl font-medium transition cursor-pointer"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Sign in link */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-emerald-600 underline hover:text-emerald-500"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
