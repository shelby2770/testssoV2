import * as React from "react";
import { Link } from "react-router";
import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import { useAuth } from "../context/AuthContext";

export function Welcome() {
  const { isAuthenticated, user } = useAuth();
  const [activeFeature, setActiveFeature] = React.useState(0);

  // Animation for the hero section
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI5MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cmVjdCBmaWxsPSIjMDQwNjE2IiB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI5MDAiLz48Y2lyY2xlIGZpbGwtb3BhY2l0eT0iLjA1IiBmaWxsPSIjZmZmIiBjeD0iNzIwIiBjeT0iNDUwIiByPSI0MDAiLz48Y2lyY2xlIGZpbGwtb3BhY2l0eT0iLjA1IiBmaWxsPSIjZmZmIiBjeD0iNzIwIiBjeT0iNDUwIiByPSIzMDAiLz48Y2lyY2xlIGZpbGwtb3BhY2l0eT0iLjA1IiBmaWxsPSIjZmZmIiBjeD0iNzIwIiBjeT0iNDUwIiByPSIyMDAiLz48Y2lyY2xlIGZpbGwtb3BhY2l0eT0iLjA1IiBmaWxsPSIjZmZmIiBjeD0iNzIwIiBjeT0iNDUwIiByPSIxMDAiLz48Y2lyY2xlIGZpbGwtb3BhY2l0eT0iLjA1IiBmaWxsPSIjZmZmIiBjeD0iNzIwIiBjeT0iNDUwIiByPSI1MCIvPjwvZz48L3N2Zz4=')] bg-cover opacity-20"></div>
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
              <div className="inline-block mb-4">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-6">
                  <div className="h-2 w-2 bg-cyan-400 rounded-full animate-ping"></div>
                  <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">
                    Secure Authentication
                  </div>
                </div>
                <h1 className="text-6xl font-extrabold text-white mb-6 leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                    WebAuthn
                  </span>
                  <span className="block mt-2">Single Sign-On</span>
                </h1>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 mb-6">
                  <span className="text-xs font-semibold text-cyan-400 mr-2">
                    NEW
                  </span>
                  <span className="text-sm text-white">
                    Version 2.0 Release
                  </span>
                </div>
              </div>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Experience the future of authentication. No passwords, no
                compromises, just seamless and secure access to all your
                applications.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/register"
                      className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-cyan-500/20 transform hover:-translate-y-1 transition-all duration-300 text-center"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/login"
                      className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm text-white font-medium rounded-xl border border-slate-700 hover:border-cyan-500/50 transform hover:-translate-y-1 transition-all duration-300 text-center"
                    >
                      Sign In
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/profile"
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-cyan-500/20 transform hover:-translate-y-1 transition-all duration-300 text-center"
                  >
                    View Profile
                  </Link>
                )}
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative w-full h-96">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-3xl transform rotate-3 scale-95 blur-xl"></div>
                <div className="absolute inset-0 backdrop-blur-xl bg-slate-900/90 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-12 bg-slate-800/80 backdrop-blur-sm flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="pt-16 px-6 pb-6">
                    <div className="flex items-center justify-center h-64">
                      <div className="w-full max-w-xs mx-auto">
                        <div className="mb-6 text-center">
                          <div className="w-16 h-16 mx-auto bg-cyan-900/30 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-cyan-500/20">
                            <svg
                              className="w-8 h-8 text-cyan-400"
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
                          <h3 className="text-lg font-semibold text-gray-200">
                            {isAuthenticated
                              ? "Authentication Complete"
                              : "Authenticate with WebAuthn"}
                          </h3>
                          <p className="text-sm text-gray-400 mt-2">
                            {isAuthenticated
                              ? `Welcome back, ${user?.username || "User"}!`
                              : "Use your security key or biometrics"}
                          </p>
                        </div>
                        <div className="relative">
                          {isAuthenticated ? (
                            <div className="flex flex-col items-center">
                              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                                <svg
                                  className="w-6 h-6 text-green-400"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div className="text-center text-sm text-green-400">
                                Identity Verified
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="h-10 w-10 mx-auto border-t-2 border-b-2 border-cyan-400 rounded-full animate-spin"></div>
                              <div className="mt-4 text-center text-sm text-cyan-400">
                                Verifying your identity...
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mb-24 px-4">
          <div className="text-center mb-16">
            <div className="inline-block">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="h-1.5 w-1.5 bg-purple-400 rounded-full"></div>
                <div className="text-xs uppercase tracking-widest text-purple-400 font-semibold">
                  Next Generation
                </div>
                <div className="h-1.5 w-1.5 bg-purple-400 rounded-full"></div>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Powerful Authentication Features
              </h2>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our platform combines the security of WebAuthn with the
              convenience of Single Sign-On
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`backdrop-blur-lg bg-slate-800/40 rounded-xl p-6 border ${
                  activeFeature === index
                    ? "border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                    : "border-slate-700 hover:border-purple-500/50"
                } transform transition-all duration-300 hover:-translate-y-2`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="flex flex-col items-center text-center mb-4">
                  <div
                    className={`p-3 rounded-full mb-4 ${
                      activeFeature === index
                        ? "bg-gradient-to-r from-cyan-500/20 to-purple-600/20 animate-pulse"
                        : "bg-slate-700/50"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-300 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works Section */}
        <div className="max-w-5xl mx-auto mb-24 px-4">
          <div className="text-center mb-16">
            <div className="inline-block">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full"></div>
                <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">
                  Simple Process
                </div>
                <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full"></div>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                How It Works
              </h2>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Simple, secure, and passwordless authentication in three easy
              steps
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 hidden md:block z-0"></div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg mb-6 z-10">
                    {index + 1}
                  </div>
                  <div className="backdrop-blur-lg bg-slate-800/40 rounded-xl p-6 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 w-full h-full">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-white mb-4">
                        {step.title}
                      </h3>
                      <p className="text-gray-300">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-600/30 rounded-3xl transform rotate-1 scale-105 blur-xl"></div>
            <div className="relative backdrop-blur-xl bg-slate-900/80 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-800">
              <div className="md:flex items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-8">
                  <div className="inline-flex items-center mb-2">
                    <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-md mr-2">
                      V2
                    </span>
                    <span className="text-cyan-400 text-sm">
                      Upgraded Experience
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Ready to get started?
                  </h2>
                  <p className="text-gray-300 text-lg">
                    Join thousands of organizations using our secure
                    authentication platform.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  {!isAuthenticated ? (
                    <>
                      <Link
                        to="/register"
                        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-cyan-500/20 transform hover:-translate-y-1 transition-all duration-300 text-center"
                      >
                        Create Account
                      </Link>
                      <Link
                        to="/login"
                        className="px-8 py-4 bg-transparent text-white border border-slate-600 hover:border-cyan-500/50 font-medium rounded-xl hover:bg-white/5 transform hover:-translate-y-1 transition-all duration-300 text-center"
                      >
                        Sign In
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/profile"
                        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-cyan-500/20 transform hover:-translate-y-1 transition-all duration-300 text-center"
                      >
                        My Account
                      </Link>
                      <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-4 bg-transparent text-white border border-slate-600 hover:border-cyan-500/50 font-medium rounded-xl hover:bg-white/5 transform hover:-translate-y-1 transition-all duration-300 text-center"
                      >
                        Refresh
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-gray-400">
              No credit card required • Free trial available • Enterprise
              support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    title: "Secure Authentication",
    description:
      "Enterprise-grade security with FIDO2 passwordless authentication.",
    icon: (
      <svg
        className="w-8 h-8 text-cyan-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
  },
  {
    title: "Single Sign-On",
    description: "One authentication for all your applications and services.",
    icon: (
      <svg
        className="w-8 h-8 text-cyan-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    title: "Phishing-Resistant",
    description: "Eliminates credential theft and phishing attacks completely.",
    icon: (
      <svg
        className="w-8 h-8 text-cyan-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    title: "Cross-Platform",
    description: "Works across all modern browsers and operating systems.",
    icon: (
      <svg
        className="w-8 h-8 text-cyan-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
        />
      </svg>
    ),
  },
];

const steps = [
  {
    title: "Register",
    description:
      "Create an account using your security key, fingerprint, or face recognition.",
  },
  {
    title: "Authenticate",
    description:
      "Sign in with a simple tap or biometric verification - no passwords to remember.",
  },
  {
    title: "Access",
    description:
      "Seamlessly access all your applications with a single authentication.",
  },
];
