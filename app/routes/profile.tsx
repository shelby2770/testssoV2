import * as React from "react";
import Profile from "../components/Profile";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import type { Route } from "./+types/profile";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profile - WebAuthn SSO" },
    {
      name: "description",
      content: "View your user profile and SSO token information.",
    },
  ];
}

export default function ProfilePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  // Handle authentication check
  React.useEffect(() => {
    // Only redirect if not loading and not authenticated
    if (!isLoading && !isAuthenticated) {
      // Use window.location for direct navigation instead of React Router redirect
      window.location.href = "/login";
    }
  }, [isAuthenticated, isLoading]);

  // If loading or will redirect, show a loading state
  if (isLoading || (shouldRedirect && !isAuthenticated)) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </Layout>
    );
  }

  // Only render the profile if authenticated
  if (isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mt-10">
              <Profile />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // This should never render due to the useEffect redirect
  return null;
}
