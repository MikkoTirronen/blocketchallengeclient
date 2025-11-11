// src/context/UserContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { api, setAuthHandlers } from "../api/axiosClient";

const UserContext = createContext<any>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setAuthHandlers(setUser, setToken);
  }, []);

  async function login(username: string, password: string) {
    const res = await api.post("/auth/login", { username, password });
    setToken(res.data.token);
    setUser(jwtDecode(res.data.token));
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
