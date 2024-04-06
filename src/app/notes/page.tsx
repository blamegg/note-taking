"use client";
import { AddNotes } from "@/components";
import { CustomLayout } from "@/components";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { userContext } from "@/authContext/AuthContext";

const Notes = () => {
  const router = useRouter();
  const { session } = useContext(userContext);

  if (!session.userLogged) {
    router.push("/");
    return null;
  }

  return (
    <CustomLayout>
      <AddNotes />
    </CustomLayout>
  );
};

export default Notes;
