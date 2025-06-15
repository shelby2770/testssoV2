import * as React from "react";
import { startAuthentication } from "../utils/webauthn";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [animateButton, setAnimateButton] = React.useState(false);
  const [showRetryOption, setShowRetryOption] = React.useState(false);

  const handleClearAndRetry = async () => {
    setShowRetryOption(false);
    setError(null);

    try {
      // Clear authentication challenges endpoint
      await fetch(
        "https://testsso.asiradnan.com/api/auth/clear-auth-challenges/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username.trim() }),
          credentials: "include",
        }
      );

      setError(
        "Authentication challenges cleared. You can now try logging in again."
      );
    } catch (err) {
      setError("Failed to clear challenges. Please contact support.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAnimateButton(true);

    try {
      // Check if browser supports WebAuthn
      if (!window.PublicKeyCredential) {
        throw new Error("WebAuthn is not supported in this browser");
      }

      const response = await startAuthentication(username.trim() || undefined);

      // Check for successful authentication (handle both field names)
      if (response.authenticated || response.verified || response.success) {
        console.log("✅ Authentication successful, logging in user");
        login(response.sso_token);
      } else {
        throw new Error("Authentication failed - no success indicator");
      }
    } catch (err: any) {
      console.error("❌ Authentication error:", err);

      // Handle specific error cases
      if (
        err.message &&
        err.message.includes("Multiple authentication attempts")
      ) {
        setError(
          "Multiple authentication attempts detected. This usually happens when previous attempts weren't completed properly."
        );
        setShowRetryOption(true);
      } else if (err.message && err.message.includes("Challenge not found")) {
        setError("Authentication session expired. Please try again.");
      } else if (err.message && err.message.includes("Credential not found")) {
        setError("No registered security key found. Please register first.");
      } else {
        setError(err.message || "Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => setAnimateButton(false), 500);
    }
  };

  return (
    <div className="relative max-w-md mx-auto">
      {/* Background elements */}
      <div className="absolute -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="backdrop-blur-xl bg-slate-900/80 rounded-3xl shadow-2xl overflow-hidden p-8 border border-slate-800 transform transition-all duration-300 hover:shadow-cyan-500/10">
        <div className="relative">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full"></div>
            <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              Secure Access
            </div>
            <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full"></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Login with WebAuthn
            <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white">
              V2
            </span>
          </h2>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
            <svg
              className="w-5 h-5 text-white"
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

        {error && (
          <div className="bg-red-900/30 backdrop-blur-sm border border-red-500/30 text-red-300 p-4 mb-6 rounded-xl animate-pulse">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {showRetryOption && (
          <div className="bg-yellow-900/30 backdrop-blur-sm border border-yellow-500/30 text-yellow-300 p-4 mb-6 rounded-xl">
            <div className="flex justify-between items-center">
              <p className="text-sm">
                Clear previous authentication attempts and try again?
              </p>
              <button
                onClick={handleClearAndRetry}
                className="ml-4 px-3 py-1 bg-yellow-500/80 text-black text-sm rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Clear & Retry
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="bg-blue-900/30 backdrop-blur-sm border border-blue-500/30 text-blue-300 p-4 mb-6 rounded-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="animate-spin h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium">Please touch your security key</p>
                <p className="text-sm">
                  Touch the gold contact when your security key blinks
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Username (optional)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
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
              </div>
              <input
                type="text"
                id="username"
                className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 focus:border-cyan-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white transition-colors duration-200"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Leave empty for passkey login"
                disabled={isLoading}
              />
            </div>
            <p className="mt-2 text-sm text-gray-400">
              If you have a passkey, you can leave this empty
            </p>
          </div>

          <div>
            <button
              type="submit"
              className={`w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 ${
                animateButton ? "animate-pulse scale-105" : ""
              } ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
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
                  Login with WebAuthn
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account yet?{" "}
            <Link
              to="/register"
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
