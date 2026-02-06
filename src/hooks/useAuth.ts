import { useState, useEffect } from "react";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  company_name?: string;
  created_at?: string;
  email_verified?: boolean;
  npwp_verified?: boolean;
  email_verified_at?: string;
  npwp_valid_until?: string;
  balance?: number;
  points?: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch user data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        window.location.href = "/auth/customer-login"; // redirect to login
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return { user, loading, error, logout };
};
