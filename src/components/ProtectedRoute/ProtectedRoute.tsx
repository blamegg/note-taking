import { userContext } from "@/authContext/AuthContext";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useContext(userContext);
  const router = useRouter();

  const isAuthenticated = session.userLogged;

  if (!isAuthenticated) {
    router.push("/");
    return null;
  } else {
    return <>{children}</>;
  }
};
