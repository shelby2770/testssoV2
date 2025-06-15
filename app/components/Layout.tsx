import * as React from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = React.useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <div className="fixed top-0 left-0 w-full z-50">
        {/* Decorative top border */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 bg-[length:200%_auto] animate-[gradient_3s_ease_infinite]"></div>

        <nav
          className={`transition-all duration-300 ${
            scrolled
              ? "bg-slate-800/95 backdrop-blur-xl shadow-lg shadow-purple-500/10"
              : "bg-slate-800/80 backdrop-blur-lg"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo area */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="group flex items-center">
                  <div className="relative mr-2">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700">
                      <svg
                        className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                      WebAuthn SSO
                    </span>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-300">
                        Enterprise Security
                      </span>
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-md font-bold animate-pulse">
                        V2
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Center area with profile link if authenticated */}
              <div className="hidden md:flex md:items-center md:justify-center">
                {isAuthenticated && (
                  <Link
                    to="/profile"
                    className={`
                      relative px-4 py-1.5 rounded-full transition-all duration-300
                      ${
                        isActive("/profile")
                          ? "text-white"
                          : "text-gray-300 hover:text-white"
                      }
                    `}
                  >
                    {isActive("/profile") && (
                      <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-full -z-10"></span>
                    )}
                    <span className="relative z-10 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile
                    </span>
                  </Link>
                )}
              </div>

              {/* Right side with auth controls */}
              <div className="flex items-center space-x-4">
                {isLoading ? (
                  <div className="relative h-8 w-8">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping"></div>
                    <div className="absolute inset-1 rounded-full border-t-2 border-cyan-500 animate-spin"></div>
                  </div>
                ) : isAuthenticated ? (
                  <div className="flex items-center bg-slate-700/80 backdrop-blur-sm rounded-full pl-3 pr-1 py-1 border border-slate-600">
                    <span className="text-sm text-gray-200 mr-2">
                      {user?.username}
                    </span>
                    <Link
                      to="/profile"
                      className="p-1.5 rounded-full text-gray-200 hover:text-white bg-slate-600 hover:bg-slate-500 transition-colors duration-200"
                    >
                      <span className="sr-only">View profile</span>
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </Link>
                  </div>
                ) : (
                  <div className="flex space-x-3 relative">
                    <Link
                      to="/login"
                      className={`
                        group relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl
                        transition-all duration-300 transform overflow-hidden
                        ${isActive("/login") ? "scale-105" : ""}
                      `}
                    >
                      <span
                        className={`absolute inset-0 w-full h-full transition-all duration-300 ${
                          isActive("/login")
                            ? "bg-gradient-to-r from-cyan-500 to-cyan-600 opacity-100"
                            : "bg-slate-700 group-hover:bg-slate-600"
                        }`}
                      ></span>
                      <span
                        className={`absolute inset-0 w-0 h-full transition-all duration-300 ${
                          isActive("/login")
                            ? ""
                            : "bg-gradient-to-r from-cyan-500 to-cyan-600 opacity-0 group-hover:w-full group-hover:opacity-100"
                        }`}
                      ></span>
                      <span className="relative z-10 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                        <span
                          className={`${
                            isActive("/login")
                              ? "text-white"
                              : "text-cyan-300 group-hover:text-white"
                          }`}
                        >
                          Login
                        </span>
                      </span>
                      {isActive("/login") && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/register"
                      className={`
                        group relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl
                        transition-all duration-300 transform overflow-hidden
                        ${isActive("/register") ? "scale-105" : ""}
                      `}
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"></span>
                      <span className="absolute inset-0 w-full h-full transition-all duration-300 bg-gradient-to-r from-purple-600 to-purple-700 opacity-0 group-hover:opacity-100"></span>
                      <span className="relative z-10 flex items-center text-white">
                        <svg
                          className="w-4 h-4 mr-1.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                        Register
                      </span>
                      {isActive("/register") && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                        </span>
                      )}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>

      <main className="py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>

      <footer className="backdrop-blur-xl bg-slate-800/80 border-t border-slate-700/80 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-300">
            WebAuthn SSO Implementation © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
