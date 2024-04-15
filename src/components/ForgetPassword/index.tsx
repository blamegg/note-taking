import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { ChangeEvent, FormEvent, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 5,
  p: 5,
};

export const ForgetPassword = () => {
  const [open, setOpen] = useState(false);
  const [credential, setCredential] = useState({ email: "" });
  const [send, setSend] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredential((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!credential["email"]) {
      return null;
    }
    handleForgetPassword();
    setCredential({ email: "" });
    setSend(true);
    setTimeout(() => {
      setSend(false);
    }, 8000);
  };

  const handleForgetPassword = async () => {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, credential.email);
  };

  return (
    <>
      <div
        className="text-gray-700 text-sm cursor-pointer hover:text-blue-700"
        onClick={handleOpen}
      >
        Forget Password
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="bg-white rounded-xl">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <div>
                  <label
                    htmlFor="name"
                    className="w-full inline-block mr-4 text-gray-500 uppercase"
                  >
                    enter email address
                  </label>
                </div>
                <input
                  name="email"
                  id="name"
                  type="email"
                  onChange={handleChange}
                  value={credential.email}
                  placeholder="example@gmail.com"
                  className="w-full border-b-2 border-gray-400 py-2 placeholder-gray-300 outline-none focus:border-green-400"
                />
              </div>

              {send && (
                <div className="text-xs font-bold text-green-400 uppercase mt-5 mb-5">
                  check your email for password reset link
                </div>
              )}

              <div className="text-right">
                <button
                  type="submit"
                  className="py-2 px-3 bg-green-500 text-green-100 font-bold rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </>
  );
};
