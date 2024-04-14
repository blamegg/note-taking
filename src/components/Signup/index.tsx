import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import { useRouter } from "next/navigation";
import { userContext } from "@/authContext/AuthContext";
import googleLogo from "@/assets/profile.jpg";

export const Signup = () => {
  const [userData, setUserData] = useState({
    displayName: "",
    email: "",
    password: "",
    renterPassword: "",
  });
  const [match, setMatch] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordSuggestions, setPasswordSuggestions] = useState<string[]>([]);

  const { customCreateAccount, customGooglePopUp, customGitHubPopUp, session } =
    useContext(userContext);
  const router = useRouter();

  if (session.userLogged) {
    router.push("/");
    return null;
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    console.log("work");
    event.preventDefault();
    if (
      userData.displayName === "" ||
      userData.email === "" ||
      userData.password === "" ||
      userData.password !== userData.renterPassword
    ) {
      setMatch("password does not match");
      return null;
    }
    customCreateAccount(userData);
    router.push("notes");
    setMatch("");
    setUserData({
      displayName: "",
      email: "",
      password: "",
      renterPassword: "",
    });
  };

  const handleGoogleClick = async () => {
    await customGooglePopUp();
    router.push("notes");
  };

  const handleGithubClick = async () => {
    await customGitHubPopUp();
    router.push("notes");
  };

  return (
    <div className="h-[100vh] flex items-center justify-center bg-blue-400">
      <div className="bg-white px-16 py-8 rounded shadow-2x1 w-[90%] lg:w-[40%]">
        <h2 className="text-2xl text-center font-bold mb-10 text-gray-800">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label className="text-sm block mb-1 font-bold text-gray-500">
              Display Name
            </label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 p-2 rounded outline-none focus:border-purple-500"
              name="displayName"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm block mb-1 font-bold text-gray-500">
              Email
            </label>
            <input
              type="email"
              className="w-full border-2 border-gray-200 p-2 rounded outline-none focus:border-purple-500"
              name="email"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm block mb-1 font-bold text-gray-500">
              Password
            </label>
            <input
              type="password"
              className="w-full border-2 border-gray-200 p-2 rounded outline-none focus:border-purple-500"
              name="password"
              onChange={handleChange}
            />
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
          </div>
          <div>
            <label className="text-sm block mb-1 font-bold text-gray-500">
              Re-enter Password
            </label>
            <input
              type="password"
              className="w-full border-2 border-gray-200 p-2 rounded outline-none focus:border-purple-500"
              name="renterPassword"
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <input type="checkbox" id="agree" />
              <label htmlFor="agree" className="text-xs ml-2 text-gray-700">
                I agree to the terms and privacy
              </label>
            </div>
            <div
              className="text-gray-700 text-xs cursor-pointer hover:text-blue-600"
              onClick={() => router.push("login")}
            >
              already have account? login
            </div>
          </div>

          {match && (
            <p className="text-sm text-red-500">password doesn't match</p>
          )}

          <div className="space-y-2 !mt-5">
            <div className="grid place-items-center w-full text-sm bg-yellow-400 hover:bg-yellow-300 p-2 rounded text-yellow-900 hover:text-yellow-800 transition duration-300">
              <button type="submit">Sign Up</button>
            </div>
            <div className="grid place-items-center w-full text-sm bg-yellow-400 hover:bg-yellow-300 p-2 rounded text-yellow-900 hover:text-yellow-800 transition duration-300">
              <button type="button" onClick={handleGoogleClick}>
                Sign Up with google
              </button>
            </div>

            <div className="grid place-items-center w-full text-sm bg-yellow-400 hover:bg-yellow-300 p-2 rounded text-yellow-900 hover:text-yellow-800 transition duration-300">
              <button type="button" onClick={handleGithubClick}>
                Sign Up with github
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
