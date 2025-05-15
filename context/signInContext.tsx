"use client"
import { createContext,useContext, useState } from "react";

interface SignInContextType {
  signInCredentials: {
    id: string;
    password: string;
  }
  setSignInCredentials: (credentials: { id: string; password: string }) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  handleCredentialsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const SignInContext = createContext<SignInContextType>({
  signInCredentials: {
    id: "",
    password: "",
  },
  setSignInCredentials: () => {},
  loading: false,
  setLoading: () => {},
  handleCredentialsChange: () => {},
});

export function useSignInContext() {
  return useContext(SignInContext);
}

export function SignInProvider({ children }:{children: React.ReactNode}) {
  const [signInCredentials, setSignInCredentials] = useState({
    id: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleCredentialsChange = (e:
    React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement >
  ) => {
    setSignInCredentials({
      ...signInCredentials,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <SignInContext.Provider value={{ signInCredentials, setSignInCredentials, loading, setLoading,handleCredentialsChange }}>
      {children}
    </SignInContext.Provider>
  );
}