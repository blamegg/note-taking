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
import { background_profile } from "@/assets";
import { MdVerified } from "react-icons/md";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";

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
    phoneNumber: "",
  });
  const [mobile, setMobile] = useState("");
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { session } = useContext(userContext);

  useEffect(() => {
    const getMobile = async () => {
      const email = session.userInfo.email;
      const userMoibleRef = collection(db, email);
      const userMobileSnapshot = await getDocs(userMoibleRef);
      const information = userMobileSnapshot.docs.map((doc) => ({
        mobile: doc.data(),
      }));
      setMobile(information[0]?.mobile.phoneNumber ?? "");
    };
    getMobile();
  }, [session]);

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
  const handleOpen = () => {
    setOpen(true);
    setProfile({
      displayName: session.userInfo.displayName,
      phoneNumber: session.userInfo.phoneNumber,
      url: "",
    });
  };
  const handleClose = () => {
    setOpen(false);
    setProfile({
      displayName: "",
      phoneNumber: "",
      url: "",
    });
  };

  if (!session.userLogged) {
    router.push("/");
    return null;
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement | any>) => {
    const selectedFile = e.target?.files[0];
    setFile(selectedFile);
  };

  const updateMobile = async (newNumber: string) => {
    const email = session.userInfo.email;
    const currentNoteRef = doc(db, session.userInfo.uid, email);
    const currentNote = await getDoc(currentNoteRef);
    const noteRef = doc(db, email, "personal");
    await updateDoc(noteRef, {
      phoneNumber: newNumber,
    });
    // await updatePhoneNumber(currentUser, ph);
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
    if (
      auth.currentUser === null ||
      profile.displayName === "" ||
      profile.phoneNumber === ""
    ) {
      return null;
    }
    await updateProfile(auth.currentUser, {
      displayName: profile.displayName,
    });
    updateMobile(profile.phoneNumber);
    uploadFile();
    handleClose();
    getMobile();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfile((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const getMobile = async () => {
    const email = session.userInfo.email;
    const userMoibleRef = collection(db, email);
    const userMobileSnapshot = await getDocs(userMoibleRef);
    const information = userMobileSnapshot.docs.map((doc) => ({
      mobile: doc.data(),
    }));
    setMobile(information[0]?.mobile.phoneNumber ?? "");
  };

  return (
    <>
      <div className="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900 border-2 border-indigo-500">
        <div className="rounded-t-lg border-b-2 border-indigo-500 h-32 overflow-hidden">
          <img
            className="object-cover object-top w-full"
            src={background_profile.src}
            alt="Mountain"
          />
        </div>
        <div className="mx-auto w-32 h-32 relative -mt-16 border-2 border-indigo-500 rounded-full overflow-hidden">
          <img
            className="object-cover object-center h-32"
            src={
              profile.url || session.userInfo.photoURL || background_profile.src
            }
            alt="Woman looking front"
          />
        </div>
        <div className="text-center mt-2">
          {session.userInfo?.displayName && (
            <div className="flex gap-2 justify-center items-center">
              <h2 className="font-semibold">{session.userInfo?.displayName}</h2>
              {session.userInfo.emailVerified && (
                <MdVerified className="h-5 w-5" />
              )}
            </div>
          )}
          <p className="text-gray-500">{session.userInfo?.email}</p>
          <p className="text-gray-500">
            {session.userInfo?.metadata?.creationTime}
          </p>
          {session.userInfo?.phoneNumber && (
            <p className="text-gray-500">{session.userInfo?.phoneNumber}</p>
          )}
          <p className="text-gray-500">
            {mobile !== "" && <span>{mobile}</span>}
          </p>
        </div>
        <div className="p-4 border-t mx-8 mt-2 flex justify-center items-center">
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
                    value={profile.displayName}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-400  placeholder-gray-300 outline-none focus:border-green-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className=" text-right text-gray-500 uppercase"
                  >
                    phone number
                  </label>
                </div>
                <div>
                  <input
                    name="phoneNumber"
                    id="name"
                    type="number"
                    value={profile.phoneNumber}
                    placeholder="+91 99999999999"
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
