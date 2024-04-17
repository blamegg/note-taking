"use client";
import { AddNotes } from "@/components";
import { CustomLayout } from "@/components";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { userContext } from "@/authContext/AuthContext";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

const Home = () => {
  const router = useRouter();
  const { session } = useContext(userContext);

  useEffect(() => {
    registerUserDB();
  }, []);

  if (!session.userLogged) {
    router.push("/login");
    return null;
  }

  const registerUserDB = async () => {
    if (session.userInfo) {
      const userRef = collection(db, `${session.userInfo.email}`);
      await setDoc(doc(userRef, "personal"), {
        phoneNumber: session.userInfo.phoneNumber ?? "",
      });
    }
  };

  return (
    <CustomLayout>
      {" "}
      <AddNotes />{" "}
    </CustomLayout>
  );
};

export default Home;
