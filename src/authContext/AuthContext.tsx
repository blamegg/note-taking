"use client";
import React, { createContext, useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { auth } from "@/firebase/config";

export const userContext = createContext<any>(null);
const provider = new GoogleAuthProvider();
const oAuth = getAuth();

const initialState = {
  userLogged: false,
  status: "",
  userInfo: {},
};

const AuthContext = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState(initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession({
          userLogged: true,
          status: "",
          userInfo: user,
        });
      } else {
        setSession({
          userLogged: false,
          status: "",
          userInfo: {},
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const customLoginEmailPassword = async (email: string, password: string) => {
    const user = await signInWithEmailAndPassword(auth, email, password);
    setSession({
      userLogged: true,
      status: "",
      userInfo: user.user,
    });
  };

  const customGooglePopUp = async () => {
    const user = await signInWithPopup(oAuth, provider);
    setSession({
      userLogged: true,
      status: "",
      userInfo: user.user,
    });
  };

  const customCreateAccount = async (userData: {
    email: string;
    password: string;
  }) => {
    const user = await createUserWithEmailAndPassword(
      oAuth,
      userData.email,
      userData.password
    );
    setSession({
      userLogged: true,
      status: "",
      userInfo: user.user,
    });
  };

  const customLogout = async () => {
    await signOut(oAuth);
    setSession({
      userLogged: false,
      status: "",
      userInfo: {},
    });
  };

  return (
    <userContext.Provider
      value={{
        session,
        customLoginEmailPassword,
        customGooglePopUp,
        customCreateAccount,
        customLogout,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default AuthContext;
