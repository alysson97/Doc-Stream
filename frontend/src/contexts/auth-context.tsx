'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  login as apiLogin,
  refreshToken as apiRefresh,
  setAccessToken,
} from "@/lib/api";

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
  }, []);

  // Try to restore session via refresh token on mount
  useEffect(() => {
    let mounted = true;
    async function tryRefresh() {
      try {
        const data = await apiRefresh();
        if (mounted) {
          setAccessToken(data.accessToken);
          // Decode basic info from token or keep minimal user info
          // Since refresh only returns accessToken, we store a minimal user
          const stored = sessionStorage.getItem("user");
          if (stored) {
            setUser(JSON.parse(stored));
          }
        }
      } catch {
        // No valid session
        if (mounted) {
          setUser(null);
          setAccessToken(null);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    tryRefresh();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    setAccessToken(data.accessToken);
    const userData = { name: data.name, email: data.email, role: data.role };
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
