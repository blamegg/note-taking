"use client";
import { AddNotes } from "@/components";
import { CustomLayout } from "@/components";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { userContext } from "@/authContext/AuthContext";

const Home = () => {
  const router = useRouter();
  const { session } = useContext(userContext);

  if (!session.userLogged) {
    router.push("/login");
    return null;
  }

  return <CustomLayout> gg {/* <AddNotes /> */}</CustomLayout>;
};

export default Home;
