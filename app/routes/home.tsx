import * as React from "react";
import { Welcome } from "../welcome/welcome";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "WebAuthn SSO - Secure Passwordless Authentication" },
    {
      name: "description",
      content:
        "Your gateway to seamless authentication and secure access. Enterprise-grade security with easy integration.",
    },
  ];
}

export default function Home() {
  const { loginStatus, clearLoginStatus } = useAuth();
  const { showToast } = useToast();

  // Check for logout success flag from localStorage immediately on mount
  React.useEffect(() => {
    const logoutSuccess = localStorage.getItem("logout_success");
    if (logoutSuccess === "true") {
      // Show toast and remove the flag
      showToast("Successfully logged out!", "success");
      localStorage.removeItem("logout_success");
    }
  }, [showToast]); // Only depend on showToast to run once on mount

  // Handle login toast separately
  React.useEffect(() => {
    if (loginStatus?.success && loginStatus?.isNewLogin) {
      showToast("Successfully logged in!", "success");
      clearLoginStatus();
    }
  }, [loginStatus, clearLoginStatus, showToast]);

  return (
    <Layout>
      <Welcome />
    </Layout>
  );
}
