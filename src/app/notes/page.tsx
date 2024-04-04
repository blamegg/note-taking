"use client";
import { AddNotes } from "@/components";
import { CustomLayout } from "@/components";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { userContext } from "@/authContext/AuthContext";

const Notes = () => {
  const router = useRouter();
  const { session } = useContext(userContext);

  // if (!session.userLogged) {
  //   return (
  //     <CustomLayout>
  //       <h5 className="text-4xl font-extrabold text-center mt-5">
  //         Access Denied
  //       </h5>
  //     </CustomLayout>
  //   );
  // }

  return (
    <CustomLayout>
      <AddNotes />
    </CustomLayout>
  );
};

export default Notes;
