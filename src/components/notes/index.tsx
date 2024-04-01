"use client";
import React from "react";
import { db } from "@/firebase/config";
import { collection, addDoc, getDocs } from "firebase/firestore";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

interface IData {
  title: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
}

export const AddNotes = () => {
  const userCollectionRef = collection(db, "users");
  const handleAddNotes = (event: any) => {
    let data: IData = {
      title: "",
      description: "",
    };
    event.preventDefault();
    const formData = new FormData(event.target);
    data = {
      title: formData.get("title"),
      description: formData.get("description"),
    };
    if (data["title"] === "" || data["description"] === "") {
      return null;
    }
    addNote(data);
    // event.target.reset();
  };

  const addNote = async (data: IData) => {
    try {
      const docRef = await addDoc(userCollectionRef, data);
      console.log("added");
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const getNotes = async () => {
    const querySnapshot = await getDocs(userCollectionRef);
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} and ${JSON.stringify(doc.data())}`);
    });
  };

  getNotes();

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
    </div>
  );
};
