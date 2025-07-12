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
  const { loginStatus, clearLoginStatus, logoutStatus, clearLogoutStatus } =
    useAuth();
  const { showToast } = useToast();

  React.useEffect(() => {
    // Handle login toast
    if (loginStatus?.success && loginStatus?.isNewLogin) {
      showToast("Successfully logged in!", "success");
      clearLoginStatus();
    }
  }, [loginStatus, clearLoginStatus, showToast]);

  // Use separate useEffect for logout to ensure it runs independently
  React.useEffect(() => {
    // Handle logout toast
    if (logoutStatus?.success && logoutStatus?.isNewLogout) {
      // Delay slightly to ensure it appears after navigation completes
      setTimeout(() => {
        showToast("You have been successfully logged out", "success");
        clearLogoutStatus();
      }, 100);
    }
  }, [logoutStatus, clearLogoutStatus, showToast]);

  return (
    <Layout>
      <Welcome />
    </Layout>
  );
}
