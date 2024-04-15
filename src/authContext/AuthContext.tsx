"use client";
import React, { createContext, useState, useEffect } from "react";
import { GithubAuthProvider } from "firebase/auth";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/firebase/config";

export const userContext = createContext<any>(null);
const provider = new GoogleAuthProvider();
const providerGithub = new GithubAuthProvider();
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
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      setSession({
        userLogged: true,
        status: "",
        userInfo: user.user,
      });
    } catch (error: any) {
      console.error("Login error:", error.message);
      // setSession({
      //   userLogged: false,
      //   status: "error",
      //   userInfo: {},
      // });
    }
  };

  const customGooglePopUp = async () => {
    try {
      const user = await signInWithPopup(oAuth, provider);
      setSession({
        userLogged: true,
        status: "",
        userInfo: user.user,
      });
    } catch (error: any) {
      console.error("Google sign-in error:", error.message);
      setSession({
        userLogged: false,
        status: "error",
        userInfo: {},
      });
    }
  };

  const customGitHubPopUp = async () => {
    try {
      const result = await signInWithPopup(oAuth, providerGithub);
      setSession({
        userLogged: true,
        status: "",
        userInfo: result.user,
      });
    } catch (error: any) {
      console.error("GitHub sign-in error:", error.message);
      setSession({
        userLogged: false,
        status: "error",
        userInfo: {},
      });
    }
  };

  const customCreateAccount = async (userData: {
    email: string;
    password: string;
    displayName: string;
  }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        oAuth,
        userData.email,
        userData.password
      );

      await updateProfile(userCredential.user, {
        displayName: userData.displayName,
      });

      setSession({
        userLogged: true,
        status: "",
        userInfo: userCredential.user,
      });
    } catch (error: any) {
      console.error("Signup error:", error.message);
      setSession({
        userLogged: false,
        status: "error",
        userInfo: {},
      });
    }
  };

  const customLogout = async () => {
    try {
      await signOut(oAuth);
      setSession({
        userLogged: false,
        status: "",
        userInfo: {},
      });
    } catch (error: any) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <userContext.Provider
      value={{
        session,
        customLoginEmailPassword,
        customGooglePopUp,
        customCreateAccount,
        customLogout,
        customGitHubPopUp,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default AuthContext;
