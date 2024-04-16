"use client";
import { userContext } from "@/authContext/AuthContext";
import { getAuth, updatePassword } from "firebase/auth";
import { ChangeEvent, useContext, useState } from "react";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter, useSearchParams } from "next/navigation";

interface INewPassword {
  password: string;
  renterPassword: string;
}

const ResetNotesPassword = () => {
  const [newPassword, setNewPassword] = useState<INewPassword>({
    password: "",
    renterPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordSuggestions, setPasswordSuggestions] = useState<string[]>([]);
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
      const errors: string[] = [];
      const suggestions: string[] = [];

      if (value.length < 10) {
        errors.push("Password must be at least 10 characters long");
      }
      if (!/[A-Z]/.test(value)) {
        errors.push("Password must contain at least one uppercase letter");
      }
      if (!/[0-9]/.test(value)) {
        errors.push("Password must contain at least one number");
      }
      if (value.length > 0 && value.length < 8) {
        suggestions.push(
          "Consider using a longer password for better security"
        );
      }
      setPasswordErrors(errors);
      setPasswordSuggestions(suggestions);
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

  return (
    <div className="grid place-items-center">
      <div className="w-[80%] md:w-[40%] lg:w-[30%] mt-16 bg-white py-10 px-10 rounded-xl">
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
          {passwordErrors.map((error, index) => (
            <p key={index} className="text-sm text-red-500">
              {error}
            </p>
          ))}
          {passwordSuggestions.map((suggestion, index) => (
            <p key={index} className="text-sm text-gray-500">
              {suggestion}
            </p>
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
