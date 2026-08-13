import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function isAuthenticated() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("xccess-token");

    if (!token) {
      return false;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/check`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(!response.data.success){
        localStorage.removeItem("xccess-token");
        return false;
      }
      return true; // Return true if request succeeds
    } catch (err) {
      localStorage.removeItem("xccess-token");
      
      return false; // Return false if request fails
    }
  }

  return false; // Default return for SSR
}
export async function isAuthenticatedAdmin() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("xccess-token-Admin");

    if (!token) {
      return false;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/check`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if(!response.data.success){
        localStorage.removeItem("xccess-token-Admin");
        return false;
      }
      return true; // Return true if request succeeds
    } catch (err) {
      localStorage.removeItem("xccess-token-Admin");
      return false; // Return false if request fails
    }
  }

  return false; // Default return for SSR
}
