import type { ReactNode } from "react";
import BlogNavbar from "./BlogNavbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <BlogNavbar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8 text-center text-base text-gray-500">
          <p>© 2025 BlogSpace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
