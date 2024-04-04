"use client";
import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import { redirect } from "next/navigation";
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

interface IData {
  title: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  position: number;
  pin: boolean;
}

export const AddNotes = () => {
  const [notes, setNotes] = useState([]);
  const [updateInfo, setUpdateInfo] = useState({
    title: "",
    description: "",
  });
  const [edit, setEdit] = useState(null);
  const { session } = useContext(userContext);
  const router = useRouter();

  // if (!session.userLogged) {
  //   redirect("/");
  // }

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setUpdateInfo((prevInfo) => {
      return { ...prevInfo, [name]: value };
    });
  };

  const handleAddNotes = (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    let data = {
      title: formData.get("title"),
      description: formData.get("description"),
      position: notes.length + 1,
      pin: false,
    };
    if (data["title"] === "" || data["description"] === "") {
      return null;
    }
    addNote(data);
    event.target.reset();
  };

  const addNote = async (data: any) => {
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
      return; // Exit early if the user is not logged in or uid is not available
    }
    const notesRef = collection(db, session.userInfo.uid);
    const notesSnapshot = await getDocs(notesRef);
    const notesData = notesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setNotes(notesData);
  };

  useEffect(() => {
    fetchNotes();
  }, [session]);

  return (
    <section className="py-10">
      <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg drop-shadow-xl shadow-black">
        <h2 className="text-3xl font-semibold text-center mb-8 uppercase">
          Add Notes
        </h2>
        <form onSubmit={handleAddNotes} className=" flex flex-col gap-5">
          <TextField
            id="outlined-basic"
            label="Title"
            variant="outlined"
            name="title"
            onChange={handleChange}
            className="flex-grow"
          />
          <TextField
            id="outlined-basic"
            label="Description"
            variant="outlined"
            name="description"
            onChange={handleChange}
            className="flex-grow"
          />
          <Button
            type="submit"
            variant="contained"
            className="w-full md:w-auto mx-auto md:mx-0"
          >
            Add Note
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-10 w-full max-w-6xl mx-auto">
        {notes.map((noteDetails, index) => (
          <NotesCard
            key={index}
            noteDetails={noteDetails}
            index={index}
            deleteNote={deleteNote}
            updatePin={updatePin}
          />
        ))}
      </div>
    </section>
  );
};
