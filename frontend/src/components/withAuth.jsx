"use client";

import { useState, useEffect } from "react";
import { isAuthenticated } from "@/lib/utils";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const [authChecked, setAuthChecked] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          router.replace("/login");
        } else {
          setAuthChecked(true);
        }
      };

      checkAuth();
    }, []); // Dependency added to prevent unnecessary re-renders

    if (!authChecked) {
      return null; // Prevents flickering during redirect
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return AuthenticatedComponent;
};

export default withAuth;
