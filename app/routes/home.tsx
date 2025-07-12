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

    // Handle logout toast
    if (logoutStatus?.success) {
      showToast("Successfully logged out!", "success");
      clearLogoutStatus();
    }
  }, [
    loginStatus,
    logoutStatus,
    clearLoginStatus,
    clearLogoutStatus,
    showToast,
  ]);

  return (
    <Layout>
      <Welcome />
    </Layout>
  );
}
