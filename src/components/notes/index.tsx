"use client";
import React, { useContext, useEffect, useState, ChangeEvent } from "react";
import { db } from "@/firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  setDoc,
} from "@firebase/firestore";
import { getDatabase, ref, push, set } from "firebase/database";
import { NotesCard } from "../NotesCard";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { userContext } from "@/authContext/AuthContext";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { RiCloseFill } from "react-icons/ri";

interface IData {
  title: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  position: number;
  pin: boolean;
}

export interface INote {
  id: string;
  title: string;
  description: string;
  position: number;
  pin: boolean;
  bgColor: string;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
};

export const AddNotes = () => {
  const [notes, setNotes] = useState<INote[]>([]);
  const [updateInfo, setUpdateInfo] = useState({
    title: "",
    description: "",
  });
  const [editedInfo, setEditedInfo] = useState({
    title: "",
    description: "",
  });
  const [edit, setEdit] = useState<null | number>(null);
  const { session } = useContext(userContext);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUpdateInfo((prevInfo) => {
      return { ...prevInfo, [name]: value };
    });
  };

  const handleAddNotes = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    let data = {
      title: formData.get("title"),
      description: formData.get("description"),
      position: notes.length + 1,
      pin: false,
      bgColor: randomBgColor(),
    };
    if (data["title"] === "" || data["description"] === "") {
      return null;
    }
    addNote(data);
    event.target.reset();
    handleClose();
  };

  const addNote = async (data: IData) => {
    await addDoc(collection(db, session.userInfo.uid), data);
    fetchNotes();
  };

  const deleteNote = async (id: string) => {
    const noteRef = doc(db, session.userInfo.uid, id);
    await deleteDoc(noteRef);
    fetchNotes();
  };

  const updatePin = async (id: string) => {
    const currentNoteRef = doc(db, session.userInfo.uid, id);
    const currentNote = await getDoc(currentNoteRef);
    const noteRef = doc(db, session.userInfo.uid, id);
    await updateDoc(noteRef, {
      pin: !currentNote.data()?.pin,
    });
    fetchNotes();
  };

  const fetchNotes = async () => {
    if (!session.userLogged || !session.userInfo.uid) {
      return;
    }
    const notesRef = collection(db, session.userInfo.uid);
    const notesSnapshot = await getDocs(notesRef);
    const notesData: INote[] = notesSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      position: doc.data().position,
      pin: doc.data().pin,
      bgColor: doc.data().bgColor,
    }));
    const orderNotes = notesData.sort(
      (note1, note2) => note1.position - note2.position
    );
    setNotes(orderNotes);
  };

  const onEdit = (index: number) => {
    if (edit !== null) {
      return null;
    }
    setEdit(index);
  };

  const onSaveButton = async (noteId: string) => {
    const noteRef = doc(db, session.userInfo.uid, noteId);
    await updateDoc(noteRef, {
      ...editedInfo,
    });
    setEdit(null);
    fetchNotes();
  };

  const handleEditChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedInfo((prevInfo) => {
      return { ...prevInfo, [name]: value };
    });
  };

  useEffect(() => {
    fetchNotes();
  }, [session, fetchNotes, notes]);

  const randomBgColor = () => {
    const colors = [
      "bg-pink-300",
      "bg-purple-300",
      "bg-indigo-300",
      "bg-blue-300",
      "bg-green-300",
      "bg-yellow-300",
      "bg-orange-300",
      "bg-red-300",
      "bg-teal-300",
      "bg-cyan-300",
      "bg-gray-300",
      "bg-rose-300",
      "bg-emerald-300",
      "bg-lightBlue-300",
      "bg-fuchsia-300",
      "bg-cyan-300",
      "bg-warmGray-300",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  return (
    <section className="py-10">
      <div className="p-4 mx-8 mt-2 flex justify-center">
        <div className="relative inline-flex group" onClick={handleOpen}>
          <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt outline-none"></div>
          <a
            href="#"
            title="Get quote now"
            className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl"
            role="button"
          >
            ADD NOTES
          </a>
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
              <form onSubmit={handleAddNotes}>
                <div className="flex items-center mb-5">
                  <label
                    htmlFor="name"
                    className="w-20 inline-block text-right mr-4 text-gray-500"
                  >
                    Note Title
                  </label>
                  <input
                    name="title"
                    id="name"
                    type="text"
                    placeholder="note title..."
                    onChange={handleChange}
                    className="border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none focus:border-green-400"
                  />
                </div>
                <div className="flex items-center mb-10">
                  <label
                    htmlFor="twitter"
                    className="w-20 inline-block text-right mr-4 text-gray-500"
                  >
                    Content
                  </label>
                  <input
                    type="text"
                    name="description"
                    id="twitter"
                    placeholder="write something for your note..."
                    onChange={handleChange}
                    className="border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none focus:border-green-400"
                  />
                </div>
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
          </div>
        </Box>
      </Modal>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-5 mt-10 mx-auto w-5/6">
        {notes.map((noteDetails, index) => (
          <NotesCard
            key={index}
            noteDetails={noteDetails}
            index={index}
            deleteNote={deleteNote}
            updatePin={updatePin}
            onEdit={onEdit}
            onSaveButton={onSaveButton}
            handleEditChange={handleEditChange}
            edit={edit}
          />
        ))}
      </div>
    </section>
  );
};
