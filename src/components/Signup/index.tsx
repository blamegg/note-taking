"use client";

import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import { useRouter } from "next/navigation";
import { userContext } from "@/authContext/AuthContext";

export const Signup = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const { customCreateAccount, customGooglePopUp } = useContext(userContext);
  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    customCreateAccount(userData);
    router.push("notes");
    setUserData({
      email: "",
      password: "",
    });
  };
  const handleGoogleClick = async () => {
    await customGooglePopUp();
    router.push("notes");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-400">
      <div className="bg-white px-16 py-12 rounded shadow-2x1 w-[90%] lg:w-[40%]">
        <h2 className="text-3xl text-center font-bold mb-10 text-gray-800">
          Create Your Account
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

          <div className="flex justify-between">
            <div className="flex items-center">
              <input type="checkbox" id="agree" />
              <label htmlFor="agree" className="ml-2 text-gray-700 text-sm">
                I agree to the terms and privacy.
              </label>
            </div>
            <div
              className="text-gray-700 text-sm cursor-pointer hover:text-blue-600"
              onClick={() => router.push("login")}
            >
              already have account? login
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="submit"
              className="block w-full bg-yellow-400 hover:bg-yellow-300 p-4 rounded text-yellow-900 hover:text-yellow-800 transition duration-300"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={handleGoogleClick}
              className="block w-full bg-yellow-400 hover:bg-yellow-300 p-4 rounded text-yellow-900 hover:text-yellow-800 transition duration-300"
            >
              Sign Up with google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
