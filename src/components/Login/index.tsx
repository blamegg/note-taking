"use client";

import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import { useRouter } from "next/navigation";
import { userContext } from "@/authContext/AuthContext";
import {
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { ForgetPassword } from "@/components";

export const LoginUser = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const { customLoginEmailPassword, session } = useContext(userContext);
  const router = useRouter();

  if (session.userLogged) {
    router.push("/");
    return null;
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (userData.email === "" || userData.password === "") {
      return;
    }
    try {
      await customLoginEmailPassword(userData.email, userData.password);

      router.push("notes");
    } catch (error: any) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center bg-blue-400 h-[100vh]">
      <div className="bg-white rounded-xl p-16 shadow-2x1 w-[90%] lg:w-[35%]">
        <h2 className="text-3xl text-center font-bold mb-10 text-gray-800">
          Login Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-bold text-gray-500">Email</label>
            <input
              type="email"
              className="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-purple-500"
              name="email"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-bold text-gray-500">
              Password
            </label>
            <input
              type="password"
              className="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-purple-500"
              name="password"
              onChange={handleChange}
            />
          </div>

          {Object.keys(session.userInfo).length > 0 && (
            <h5 className="text-red-600 font-bold">invalid credentials</h5>
          )}
          <div className="flex justify-between">
            <div className="flex items-center">
              <input type="checkbox" id="agree" />
              <label
                htmlFor="agree"
                className="ml-1 text-gray-700 text-sm cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <ForgetPassword />
          </div>
          <div className="space-y-4">
            <button
              type="submit"
              className="block w-full bg-yellow-400 hover:bg-yellow-300 p-4 rounded text-yellow-900 hover:text-yellow-800 transition duration-300"
            >
              Login
            </button>
            <button
              type="button"
              className="block w-full bg-yellow-400 hover:bg-yellow-300 p-4 rounded text-yellow-900 hover:text-yellow-800 transition duration-300"
              onClick={() => {
                router.push("/signup");
              }}
            >
              Create new account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
