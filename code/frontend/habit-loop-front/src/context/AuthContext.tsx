import { createContext, useState, useEffect} from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (cookieToken) setTokenState(cookieToken);
  }, []);

  const setToken = (newToken: string | null) => {
    if (newToken) {
      document.cookie = `token=${newToken}; Secure; SameSite=Lax; path=/`;
      setTokenState(newToken);
    } else {
      document.cookie = "token=; Max-Age=0; path=/";
      setTokenState(null);
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
