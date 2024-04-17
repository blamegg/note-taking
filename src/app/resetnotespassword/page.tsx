"use client";
import { ChangeEvent, useContext, useState } from "react";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheck } from "react-icons/fa6";

interface INewPassword {
  password: string;
  renterPassword: string;
}

interface IPasswordValidation {
  length: boolean;
  upperCase: boolean;
  numeric: boolean;
  match: boolean;
}

const ResetNotesPassword = () => {
  const [newPassword, setNewPassword] = useState<INewPassword>({
    password: "",
    renterPassword: "",
  });
  const [passwordValidation, setPasswordValidation] = useState({
    length: true,
    upperCase: true,
    numeric: true,
    match: true,
  });
  const searchParams = useSearchParams();
  const router = useRouter();

  const oobCode: string | null = searchParams.get("oobCode");

  const updatePassword = async () => {
    if (oobCode) {
      await confirmPasswordReset(auth, oobCode, newPassword.password);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewPassword((prevState) => ({ ...prevState, [name]: value }));

    if (name === "password") {
      const length = value.length >= 10;
      const upperCase = /[A-Z]/.test(value);
      const numeric = /[0-9]/.test(value);
      const match = value === newPassword.renterPassword;
      setPasswordValidation({
        length,
        upperCase,
        numeric,
        match,
      });
    } else if (name === "renterPassword") {
      const match = value === newPassword.password;
      setPasswordValidation((prevState) => ({
        ...prevState,
        match,
      }));
    }
  };

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !newPassword.password ||
      !newPassword.renterPassword ||
      newPassword.password !== newPassword.renterPassword
    ) {
      return null;
    }
    updatePassword();
    setNewPassword({
      password: "",
      renterPassword: "",
    });
    router.push("login");
  };

  const errorSuggestion: {
    title: keyof IPasswordValidation;
    errorMessage: string;
  }[] = [
    {
      title: "length",
      errorMessage: "Password must be at least 10 characters long",
    },
    {
      title: "upperCase",
      errorMessage: "Password must contain at least one uppercase letter",
    },
    {
      title: "numeric",
      errorMessage: "Password must contain at least one number",
    },
    {
      title: "match",
      errorMessage: "Passwords don't match, check again",
    },
  ];

  return (
    <div className="grid place-items-center">
      <div className="xl:w-[40%] lg:w-[38%] mt-16 bg-white py-10 px-10 rounded-xl">
        <div className="mx-auto w-40 h-20">
          <img
            src="https://static.stayjapan.com/assets/top/icon/values-7dd5c8966d7a6bf57dc4bcd11b2156e82a4fd0da94a26aecb560b6949efad2be.svg"
            alt="logo"
            className="h-full w-full"
          />
        </div>
        <h5 className="text-2xl uppercase font-extrabold text-gray-700 text-center mt-5 mb-5">
          reset password
        </h5>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="capitalize">new password</label>
          </div>
          <div>
            <input
              name="password"
              id="name"
              type="password"
              value={newPassword.password}
              placeholder="password@123"
              onChange={handleChange}
              className="w-full border-b-2 border-gray-400 py-2 placeholder-gray-300 outline-none focus:border-green-400"
            />
          </div>
          <div>
            <label className="capitalize">confirm password</label>
          </div>
          <div>
            <input
              name="renterPassword"
              id="name"
              type="password"
              placeholder="password@123"
              value={newPassword.renterPassword}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-400 py-2 placeholder-gray-300 outline-none focus:border-green-400"
            />
          </div>
          {errorSuggestion.map((suggestion, index) => (
            <div className="flex gap-2" key={suggestion.title}>
              <p
                className={`text-sm ${
                  passwordValidation[suggestion.title]
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {suggestion.errorMessage}
              </p>
              {passwordValidation[suggestion.title] && <FaCheck />}
            </div>
          ))}
          <div className="p-4 mx-8 mt-2 flex justify-center">
            <div className="relative inline-flex group">
              <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt outline-none"></div>
              <a
                className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl"
                role="button"
              >
                <button className="uppercase" type="submit">
                  reset password
                </button>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetNotesPassword;
