import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { UserInfo } from "../types/UserInfo";

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; role: string }>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error loading user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);
  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const text = await res.text();

      if (res.ok) {
        return { success: true, message: "Đăng ký thành công" };
      } else {
        return { success: false, message: text || "Đăng ký thất bại" };
      }
    } catch (error) {
      return { success: false, message: "Lỗi kết nối, vui lòng thử lại" };
    } finally {
      setLoading(false);
    }
  };
  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; role: string }> => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return { success: false, role: "" };

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
        }),
      );

      setUser(data);
      return { success: true, role: data.role };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, role: "" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
