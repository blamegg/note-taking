"use client";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { userContext } from "@/authContext/AuthContext";
import Avatar from "@mui/material/Avatar";
import { RiCloseFill } from "react-icons/ri";

const customRoutes = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Profile",
    link: "/profile",
  },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const router = useRouter();
  const pathName = usePathname();
  const { customLogout, session } = useContext(userContext);
  const [vis, setVis] = useState(false);
  const handleLogout = async () => {
    await customLogout();
    setVis(false);
    router.push("/");
  };

  return (
    <>
      <nav className="bg-gray-200 shadow shadow-gray-300 w-100 px-8 md:px-auto">
        <div className="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
          <div className="text-indigo-500 md:order-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
          </div>
          <div className=" order-3 w-full md:w-auto md:order-2">
            <ul className="flex font-semibold justify-between">
              {customRoutes.map((route, index) => (
                <li
                  className={`md:px-4 md:py-2 hover:text-indigo-400 cursor-pointer ${
                    pathName === route.link
                      ? "text-indigo-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => router.push(route.link)}
                  key={index}
                >
                  {route.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="order-2 md:order-3">
            <Avatar
              className="hover:cursor-pointer relative border-2 border-indigo-500"
              src={session.userInfo.photoURL ?? ""}
              onClick={() => setVis(!vis)}
            >
              {session.userInfo.displayName?.slice(0, 1) ?? "G"}
            </Avatar>
            {vis && (
              <div className="absolute right-4 top-[8%] z-10 bg-[#BED7DC] py-8 px-6 rounded-2xl w-[24%]">
                <div
                  className="rounded-full bg-black p-1 cursor-pointer absolute top-[30px] right-5"
                  onClick={() => setVis(false)}
                >
                  <RiCloseFill className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col items-center gap-4">
                  <h5 className="text-sm">
                    {session.userInfo.email ?? "Guest@gmail.com"}
                  </h5>

                  <Avatar
                    className="hover:cursor-pointer border-2 border-indigo-500"
                    sx={{ width: 70, height: 70 }}
                    src={session.userInfo.photoURL ?? ""}
                  >
                    {session.userInfo.displayName?.slice(0, 1) ?? "G"}
                  </Avatar>

                  <h5>Hi , {session.userInfo.displayName ?? "Guest"}</h5>
                  <div className=" flex justify-center gap-5">
                    <div
                      className="relative inline-flex group"
                      onClick={() => {
                        router.push("profile");
                      }}
                    >
                      <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt outline-none"></div>
                      <a
                        href="#"
                        title="Get quote now"
                        className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl"
                        role="button"
                      >
                        Update Profile
                      </a>
                    </div>
                    <div
                      className="relative inline-flex group"
                      onClick={() => handleLogout()}
                    >
                      <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt outline-none"></div>
                      <a
                        href="#"
                        title="Get quote now"
                        className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl"
                        role="button"
                      >
                        Sign Out
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};
