"use client";
import React, { useEffect, useState } from "react";
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
} from "firebase/firestore";
import { NotesCard } from "../NotesCard";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

interface IData {
  title: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  position: number;
  pin: boolean;
}

export const AddNotes = () => {
  const [notes, setNotes] = useState([]);
  const userCollectionRef = collection(db, "users");
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

  const addNote = async (data: IData) => {
    try {
      const docRef = await addDoc(userCollectionRef, data);
      console.log("added");
      console.log("Document written with ID: ", docRef.id);
      getNotes();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const deleteNote = async (id: string) => {
    const noteRef = doc(db, "users", id);
    await deleteDoc(noteRef);
    getNotes();
  };

  const updatePin = async (id: string) => {
    const currentNoteRef = doc(db, "users", id);
    const currentNote = await getDoc(currentNoteRef);
    const noteRef = doc(db, "users", id);
    await updateDoc(noteRef, {
      pin: !currentNote.data().pin,
    });
    getNotes();
  };

  const getNotes = async () => {
    const querySnapshot = await getDocs(userCollectionRef);
    let sortedData = querySnapshot.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      .sort((a, b) => a.position - b.position);
    setNotes(sortedData);
  };

  const setUser = async () => {
    await setDoc(doc(db, "first", "second", "third", "four"), {
      name: "Los Angeles",
      state: "CA",
      country: [1, 2, 3, 4, 5],
    });
  };

  setUser();

  useEffect(() => {
    getNotes();
  }, []);

  console.log(notes);

  return (
    <div className="w-[60%] mx-auto">
      <h2 className="capitalize text-2xl font-bold text-center mt-5 mb-5">
        add notes
      </h2>
      <form
        onSubmit={handleAddNotes}
        className="flex flex-col items-center gap-2"
      >
        <label htmlFor="title">Title</label>
        <TextField
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          name="title"
        />
        <label htmlFor="Description">Description</label>
        <TextField
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          name="description"
        />
        <Button type="submit" variant="contained">
          Add
        </Button>
      </form>

      <div className="grid grid-cols-3 sm:grid-cols-2 gap-5 mt-10">
        {notes.map((noteDetails, index) => (
          <NotesCard
            key={index}
            noteDetails={noteDetails}
            deleteNote={deleteNote}
            updatePin={updatePin}
          />
        ))}
      </div>
    </div>
  );
};
