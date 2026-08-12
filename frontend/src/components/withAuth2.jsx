"use client";

import { useState, useEffect } from "react";
import { isAuthenticatedAdmin } from "@/lib/utils";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const [authChecked, setAuthChecked] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const authenticated = await isAuthenticatedAdmin();
        if (!authenticated) {
          router.replace("/admin/login");
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
