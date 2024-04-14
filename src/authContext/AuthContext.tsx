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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch (error) {
      setSession({
        userLogged: false,
        status: "",
        userInfo: {},
      });
    }
  };

  const customGooglePopUp = async () => {
    const user = await signInWithPopup(oAuth, provider);
    setSession({
      userLogged: true,
      status: "",
      userInfo: user.user,
    });
  };

  const customGitHubPopUp = async () => {
    try {
      const result = await signInWithPopup(oAuth, providerGithub);

      setSession({
        userLogged: true,
        status: "",
        userInfo: result.user,
      });
    } catch (error) {
      console.error("GitHub sign-in error:", error);
    }
  };

  const customCreateAccount = async (userData: {
    email: string;
    password: string;
    displayName: string;
  }) => {
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
        customGitHubPopUp,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default AuthContext;
