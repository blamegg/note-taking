"use client";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { auth } from "@/firebase/config";
import { userContext } from "@/authContext/AuthContext";
import Avatar from "@mui/material/Avatar";

const customRoutes = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Notes",
    link: "notes",
  },
  {
    name: "Login",
    link: "login",
  },
  {
    name: "Sign up",
    link: "signup",
  },
];

export const Header = () => {
  const router = useRouter();
  const { customLogout, session } = useContext(userContext);
  const [vis, setVis] = useState(false);
  const handleLogout = async () => {
    await customLogout();
    setVis(false);
    router.push("/");
  };
  return (
    <div className="px-5 py-4 bg-stone-400 flex justify-between items-center relative">
      <ul className="flex gap-4">
        {customRoutes.map((route, index) => (
          <li
            className="cursor-pointer text-white"
            onClick={() => router.push(route.link)}
            key={index}
          >
            {route.name}
          </li>
        ))}
      </ul>
      <div>
        <Avatar
          className="hover:cursor-pointer relative"
          src={session.userInfo.photoURL ?? ""}
          onClick={() => setVis(!vis)}
        >
          {session.userInfo.displayName?.slice(0, 1) ?? "G"}
        </Avatar>
        {vis && (
          <div className="absolute right-4 top-[85%] z-10 bg-[aliceblue] py-4 px-6 rounded-2xl w-[20%]">
            <div className="flex flex-col items-center gap-4">
              <h5 className="text-sm">
                {session.userInfo.email ?? "Guest@gmail.com"}
              </h5>
              <Avatar
                className="hover:cursor-pointer"
                sx={{ width: 70, height: 70 }}
                src={session.userInfo.photoURL ?? ""}
              >
                {session.userInfo.displayName?.slice(0, 1) ?? "G"}
              </Avatar>

              <h5>Hi , {session.userInfo.displayName ?? "Guest"}</h5>
              <button onClick={() => handleLogout()}>sign out</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
