// src/context/UserContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { api, setAccessTokenValue, setAuthHandlers } from "../api/axiosClient";

const UserContext = createContext<any>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setAuthHandlers(setUser, setToken);
  }, []);

  async function login(username: string, password: string) {
    const res = await api.post("/auth/login", { username, password });

    const token = res.data.token;
    setToken(token);
    setAccessTokenValue(token);
    // decode claims
    const decoded = jwtDecode<{
      sub: string;
      unique_name: string;
      email?: string;
    }>(token);

    // set user in a consistent shape
    setUser({
      username: decoded.unique_name,
      userId: decoded.sub,
      email: decoded.email,
      token,
    });
  }

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
    setToken(null);
  }

  return (
    <UserContext.Provider
      value={{ user, token, setUser, setToken, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
