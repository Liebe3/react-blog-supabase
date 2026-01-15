import { useState } from "react";
import {
  MdClose,
  MdContactMail,
  MdCreate,
  MdHome,
  MdInfoOutline,
  MdLogout,
  MdMenu,
  MdPerson,
} from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutThunk } from "../../thunks/authThunks";

import { resetBlogs } from "../../store/slices/blogSlice";

interface NavLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const BlogNavbar = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Base navigation links (always visible)
  const baseNavLinks: NavLink[] = [
    { name: "Home", href: "/", icon: MdHome },
    { name: "About", href: "/about", icon: MdInfoOutline },
    { name: "Contact", href: "/contact", icon: MdContactMail },
  ];

  // Conditional navigation links (only when logged in)
  const authenticatedNavLinks: NavLink[] = [
    { name: "Create Post", href: "/create", icon: MdCreate },
  ];

  // Combine nav links based on user authentication
  const navLinks: NavLink[] = user 
    ? [...baseNavLinks, ...authenticatedNavLinks] 
    : baseNavLinks;

  const handleLogout = async () => {
    dispatch(resetBlogs());
    await dispatch(logoutThunk());
    navigate("/");
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Brand */}
          <div
            className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md">
              <MdCreate size={24} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-emerald-600">BlogSpace</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your Creative Space</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const active = isActive(link.href);

              return (
                <button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-2 cursor-pointer hover:scale-105 ${
                    active
                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-emerald-600 dark:hover:text-emerald-400"
                  }`}
                >
                  <IconComponent size={18} />
                  <span>{link.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Login/Signup Buttons (Not Logged In) */}
            {!user && (
              <div className="hidden lg:flex items-center space-x-3">
                <button
                  onClick={() => navigate("/auth/login")}
                  className="px-4 py-2 rounded-lg text-emerald-600 dark:text-emerald-400 font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all duration-200 cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/auth/register")}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow-md transition-all duration-200 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* User Profile (Desktop) */}
            {user && (
              <div className="hidden sm:flex items-center space-x-3 pl-5 border-l border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
                  <MdPerson size={18} className="text-white" />
                </div>
                <div className="hidden lg:block">
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {user.profile?.first_name || "Blogger"}
                  </p>
                </div>
              </div>
            )}

            {/* Logout Button (Desktop) */}
            {user && (
              <button
                onClick={handleLogout}
                className="hidden lg:flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 cursor-pointer"
              >
                <MdLogout size={20} />
                <span className="text-base">Logout</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
          <div className="px-6 py-6 space-y-3">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const active = isActive(link.href);

              return (
                <button
                  key={link.href}
                  onClick={() => {
                    navigate(link.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-3 ${
                    active
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <IconComponent size={20} />
                  <span>{link.name}</span>
                </button>
              );
            })}

            {/* Mobile User Info */}
            {user && (
              <div className="px-4 py-4 my-3 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
                  <MdPerson size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-900 dark:text-white truncate">
                    {user.profile?.first_name || "Blogger"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Mobile Login/Signup Buttons */}
            {!user && (
              <div className="px-4 py-4 my-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <button
                  onClick={() => {
                    navigate("/auth/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 rounded-lg text-emerald-600 dark:text-emerald-400 font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all duration-200"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/auth/register");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow-md transition-all duration-200"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Logout */}
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-4 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 flex items-center space-x-3 transition-all duration-200"
              >
                <MdLogout size={22} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default BlogNavbar;