"use client";
import { User } from "lucia";
import { createContext, useContext } from "react";

type AuthProviderProps = {
  user?: User;
};

const AuthContext = createContext<AuthProviderProps | undefined>(undefined);

export const AuthProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: AuthProviderProps | undefined;
}) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const sessionContex = useContext(AuthContext);
  if (!sessionContex) {
    return;
  }

  return sessionContex;
};
