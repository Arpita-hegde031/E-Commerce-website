import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // Simulated login
    if (email && password.length >= 6) {
      setUser({ email, name: email.split("@")[0] });
      return { success: true };
    }
    return { success: false, error: "Invalid credentials" };
  };

  const register = (name, email, password) => {
    if (name && email && password.length >= 6) {
      setUser({ email, name });
      return { success: true };
    }
    return { success: false, error: "Please fill all fields correctly" };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
