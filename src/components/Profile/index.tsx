"use client";
import { userContext } from "@/authContext/AuthContext";
import { useRouter } from "next/navigation";
import { ChangeEvent, useContext, useState, useRef, useEffect } from "react";
import {
  getAuth,
  updateProfile,
  updateEmail,
  updatePhoneNumber,
  updatePassword,
} from "firebase/auth";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

export const ProfileInfo = () => {
  const [profile, setProfile] = useState({
    displayName: "",
    url: "",
  });
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { session } = useContext(userContext);

  useEffect(() => {
    const uploadFile = async () => {
      const storageRef = ref(storage, `${session.userInfo?.uid}/newFile`);
      if (storageRef) {
        const downloadURL = await getDownloadURL(storageRef);
        setProfile((prev) => ({
          ...prev,
          url: downloadURL,
        }));
      }
    };
    uploadFile();
  }, [session]);

  const storage = getStorage();
  const router = useRouter();
  const auth = getAuth();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!session.userLogged) {
    router.push("/");
    return null;
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement | any>) => {
    const selectedFile = e.target?.files[0];
    setFile(selectedFile);
  };

  const uploadFile = async () => {
    if (!file) return null;
    const storageRef = ref(storage, `${session.userInfo?.uid}/newFile`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    setProfile((prev) => ({ ...prev, url: downloadURL }));
  };

  const handleProfileChange = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (auth.currentUser === null || profile.displayName === "") {
      return null;
    }
    await updateProfile(auth.currentUser, {
      displayName: profile.displayName,
    });
    uploadFile();
    handleClose();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfile((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <>
      <div className="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900 border-2 border-indigo-500">
        <div className="rounded-t-lg border-b-2 border-indigo-500 h-32 overflow-hidden">
          <img
            className="object-cover object-top w-full"
            src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
            alt="Mountain"
          />
        </div>
        <div className="mx-auto w-32 h-32 relative -mt-16 border-2 border-indigo-500 rounded-full overflow-hidden">
          <img
            className="object-cover object-center h-32"
            src={
              profile.url ||
              session.userInfo.photoURL ||
              "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
            }
            alt="Woman looking front"
          />
        </div>
        <div className="text-center mt-2">
          {session.userInfo?.displayName && (
            <h2 className="font-semibold">{session.userInfo?.displayName}</h2>
          )}
          <p className="text-gray-500">{session.userInfo?.email}</p>
          <p className="text-gray-500">
            {session.userInfo?.metadata?.creationTime}
          </p>
          {session.userInfo?.phoneNumber && (
            <p className="text-gray-500">{session.userInfo?.phoneNumber}</p>
          )}
        </div>
        <div className="p-4 border-t mx-8 mt-2 flex justify-center">
          <div className="relative inline-flex group" onClick={handleOpen}>
            <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt outline-none"></div>
            <a
              href="#"
              title="Get quote now"
              className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl"
              role="button"
            >
              Update
            </a>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="">
            <div className="bg-white rounded-xl">
              <form
                className="flex flex-col gap-4"
                onSubmit={handleProfileChange}
              >
                <div>
                  <label
                    htmlFor="name"
                    className=" text-right text-gray-500 uppercase"
                  >
                    display Name
                  </label>
                </div>
                <div>
                  <input
                    name="displayName"
                    id="name"
                    type="text"
                    placeholder="display name"
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-400  placeholder-gray-300 outline-none focus:border-green-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="twitter"
                    className="w-full text-right mr-4 text-gray-500 uppercase"
                  >
                    Image
                  </label>
                </div>
                <div>
                  <input
                    type="file"
                    name="url"
                    id="twitter"
                    placeholder="image url"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="w-full placeholder-gray-300 outline-none"
                  />
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    type="submit"
                    className="py-2 px-3 bg-gray-900 text-white font-bold rounded-xl"
                    onClick={() => handleClose()}
                  >
                    Skip
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-3 bg-gray-900 text-white font-bold rounded-xl"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};
