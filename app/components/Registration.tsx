import * as React from "react";
import { startRegistration } from "../utils/webauthn";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router";
import { api } from "../utils/api";

export default function Registration() {
  const { login } = useAuth();
  const [username, setUsername] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [animateButton, setAnimateButton] = React.useState(false);
  const [step, setStep] = React.useState<"form" | "yubikey">("form");
  const [showRetryOption, setShowRetryOption] = React.useState(false);

  const handleClearAndRetry = async () => {
    console.log("=== CLEAR AND RETRY STARTED ===");
    console.log("Username being sent:", username.trim());
    console.log("Request payload:", { username: username.trim() });

    setShowRetryOption(false);
    setError(null);
    setIsLoading(true);

    try {
      console.log("Making API call to clear challenges...");
      console.log(
        "API endpoint:",
        "https://testsso.asiradnan.com/api/auth/clear-challenges/"
      );

      // Use the API to clear challenges
      const response = await api.clearChallenges({ username: username.trim() });

      console.log("=== CLEAR CHALLENGES RESPONSE ===");
      console.log("Response received:", response);
      console.log("Response type:", typeof response);
      console.log("Response keys:", Object.keys(response));

      if (response.success) {
        console.log("✅ Clear challenges successful");
        console.log("Deleted count:", response.deleted_count);
        console.log("Message:", response.message);

        setSuccess("Challenges cleared. You can now try registering again.");
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        console.log("❌ Clear challenges failed - success was false");
        setError("Failed to clear challenges. Please try again.");
      }
    } catch (err: any) {
      console.log("=== CLEAR CHALLENGES ERROR ===");
      console.log("Error caught:", err);
      console.log("Error name:", err.name);
      console.log("Error message:", err.message);
      console.log("Error stack:", err.stack);

      if (err.response) {
        console.log("Error response:", err.response);
        console.log("Error response status:", err.response.status);
        console.log("Error response data:", err.response.data);
      }

      setError(`Failed to clear challenges: ${err.message}`);
      console.error("Clear challenges error:", err);
    } finally {
      console.log("=== CLEAR AND RETRY FINISHED ===");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setAnimateButton(true);
    setStep("yubikey");
    setShowRetryOption(false);

    try {
      // Check if browser supports WebAuthn
      if (!window.PublicKeyCredential) {
        throw new Error(
          "WebAuthn is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari."
        );
      }

      // Check if platform supports authenticators
      const available =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      console.log("Platform authenticator available:", available);

      const response = await startRegistration(
        username.trim(),
        firstName.trim(),
        lastName.trim(),
        email.trim()
      );

      if (response.verified || response.success) {
        setSuccess(
          "Registration successful! Your YubiKey has been registered."
        );
        setStep("form");

        // If we get an SSO token, log the user in
        if (response.sso_token || response.token) {
          login(response.sso_token || response.token);
        }
      } else {
        throw new Error("Registration verification failed");
      }
    } catch (err: any) {
      if (
        err.message &&
        err.message.includes("returned more than one RegistrationChallenge")
      ) {
        setError(
          "Multiple registration attempts detected. This usually happens when previous attempts weren't completed properly."
        );
        setShowRetryOption(true);
      } else if (err.name === "NotAllowedError") {
        setError(
          "Registration was cancelled or timed out. Please try again and touch your YubiKey when prompted."
        );
      } else if (err.name === "SecurityError") {
        setError(
          "Security error occurred. Please ensure you're using HTTPS and try again."
        );
      } else if (err.name === "NotSupportedError") {
        setError(
          "Your browser or device doesn't support this type of authentication."
        );
      } else if (err.name === "InvalidStateError") {
        setError(
          "This authenticator is already registered. Please try logging in instead."
        );
      } else if (err.name === "ConstraintError") {
        setError("The authenticator doesn't meet the security requirements.");
      } else if (err.message && err.message.includes("rawId")) {
        setError(
          "Authentication device error. Please ensure your YubiKey is properly connected and try again."
        );
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
      setStep("form");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
      setTimeout(() => setAnimateButton(false), 500);
    }
  };

  return (
    <div className="relative max-w-md mx-auto">
      {/* Background elements */}
      <div className="absolute -z-10 inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="backdrop-blur-xl bg-slate-900/80 rounded-3xl shadow-2xl overflow-hidden p-8 border border-slate-800 transform transition-all duration-300 hover:shadow-purple-500/10">
        <div className="relative">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="h-1.5 w-1.5 bg-purple-400 rounded-full"></div>
            <div className="text-xs uppercase tracking-widest text-purple-400 font-semibold">
              Create Account
            </div>
            <div className="h-1.5 w-1.5 bg-purple-400 rounded-full"></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Register with WebAuthn
            <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r from-purple-500 to-cyan-600 text-white">
              V2
            </span>
          </h2>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-600 rounded-full flex items-center justify-center animate-pulse">
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
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
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
                Clear previous registration attempts and try again?
              </p>
              <button
                onClick={handleClearAndRetry}
                disabled={isLoading}
                className={`ml-4 px-3 py-1 bg-yellow-500/80 text-black text-sm rounded-lg hover:bg-yellow-400 transition-colors ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Clearing..." : "Clear & Retry"}
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-900/30 backdrop-blur-sm border border-green-500/30 text-green-300 p-4 mb-6 rounded-xl animate-pulse">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
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
              <div className="ml-3">
                <p>{success}</p>
              </div>
            </div>
          </div>
        )}

        {step === "yubikey" && isLoading && !showRetryOption && (
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
                <p className="font-medium">Touch your security key now</p>
                <p className="text-sm">
                  When your security key starts blinking, touch the gold disk
                </p>
              </div>
            </div>
          </div>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Username <span className="text-red-400">*</span>
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
                  className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 focus:border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white transition-colors duration-200"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-gray-300 text-sm font-medium mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="block w-full px-3 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 focus:border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white transition-colors duration-200"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-gray-300 text-sm font-medium mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="block w-full px-3 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 focus:border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white transition-colors duration-200"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Email
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 focus:border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white transition-colors duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className={`w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-cyan-600 hover:shadow-purple-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ${
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
                    Processing...
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
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                    Register with WebAuthn
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
