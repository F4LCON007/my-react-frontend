// src/context/UserContext.jsx
import { createContext, useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export const UserContext = createContext();

export function UserProvider({ children }) {
  const isInit = useRef(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState("");
  const [isLogInError, setIsLoginError] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (isInit.current) return;
    isInit.current = true;
    me();
  }, []);

  const me = async () => {
    try {
      const result = await fetch(`${API_URL}/api/me`, {
        credentials: "include",
      });
      if (result.ok) {
        const data = await result.json();
        setUser(data.user);
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.log("==>me() failed:", err);
    }
    setIsInitializing(false);
  };

  const login = async (email, password) => {
    const body = {
      email: email,
      password: password,
    };

    try {
      const result = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (result.ok) {
        const data = await result.json();
        setUser(data.user);
        setIsLoggedIn(true);
        setIsLoginError(false);
        return true;
      } else {
        const errData = await result.json();
        setIsLoggedIn(false);
        setIsLoginError(true);
        setLoginErrorMsg(errData.message);
        return false;
      }
    } catch (err) {
      setIsLoggedIn(false);
      setIsLoginError(true);
      setLoginErrorMsg("Unable to reach the server");
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
    } finally {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn,
        isLogInError,
        loginErrorMsg,
        isInitializing,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
