import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedUser {
  id: string;
  username: string;
  email?: string;
  exp?: number;
  iat?: number;
}

interface UserContextType {
  user: DecodedUser | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);
export function UserProvider({ children }: {children: ReactNode}) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await fetch("/api/auth/refresh", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setUser(jwtDecode(data.token));
        }
      } catch (err) {
        console.error("Failed to check session: ", err);
      }
      restoreSession();
    };
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Login Failed");
    const data = await res.json();
    setToken(data.token);
    setUser(jwtDecode(data.token));
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const userUser = () => useContext(UserContext);
