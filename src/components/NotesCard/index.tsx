"use client";
import { ChangeEvent } from "react";
import { MdDeleteOutline } from "react-icons/md";
import TextField from "@mui/material/TextField";
import { MdOutlineModeEdit } from "react-icons/md";
import { TbPinned } from "react-icons/tb";
import { TbPinnedFilled } from "react-icons/tb";
import { INote } from "../notes";

interface INotesCard {
  noteDetails: INote;
  deleteNote: (id: string) => Promise<void>;
  updatePin: (id: string) => Promise<void>;
  onEdit: (index: number, id: string) => null | undefined;
  edit: number | null;
  index: number;
  handleEditChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSaveButton: (noteId: string) => Promise<void>;
  editedInfo: {
    title: "";
    description: "";
  };
}

export const NotesCard = ({
  noteDetails,
  deleteNote,
  updatePin,
  index,
  onEdit,
  handleEditChange,
  edit,
  onSaveButton,
  editedInfo,
}: INotesCard) => {
  return (
    <div
      className={`border-2 border-gray-300 rounded-lg p-5 shadow-md ${noteDetails.bgColor}`}
    >
      <div>
        {edit === index ? (
          <div className="mb-5">
            <TextField
              id="outlined-basic"
              label="title"
              variant="outlined"
              name="title"
              onChange={handleEditChange}
              value={editedInfo.title}
              size="small"
            />
          </div>
        ) : (
          <div className="flex justify-between">
            <h3 className="text-gray-800 leading-7 font-semibold w-11/12 uppercase">
              {noteDetails.title}
            </h3>
            {noteDetails.pin && (
              <div className="flex justify-end">
                <div className="rounded-full bg-black p-1 cursor-pointer">
                  <TbPinnedFilled className="h-5 w-5 text-white" />
                </div>
              </div>
            )}
          </div>
        )}
        {edit === index ? (
          <TextField
            id="outlined-basic"
            label="description"
            variant="outlined"
            name="description"
            onChange={handleEditChange}
            value={editedInfo.description}
            size="small"
          />
        ) : (
          <p className="text-xs">{noteDetails.description}</p>
        )}
      </div>
      <div>
        <div className="flex items-center justify-start gap-4 text-gray-800 mt-4">
          <div
            className="rounded-full bg-black p-1 cursor-pointer"
            onClick={() => deleteNote(noteDetails.id)}
          >
            <MdDeleteOutline className="h-5 w-5 text-white" />
          </div>
          <div
            className="rounded-full bg-black p-1 cursor-pointer"
            onClick={() => updatePin(noteDetails.id)}
          >
            <TbPinned className="h-5 w-5 text-white" />
          </div>
          <div className="rounded-full bg-black p-1 cursor-pointer">
            {edit === index ? (
              <MdOutlineModeEdit
                className="h-5 w-5 text-white"
                onClick={() => onSaveButton(noteDetails.id)}
              />
            ) : (
              <MdOutlineModeEdit
                className="h-5 w-5 text-white"
                onClick={() => onEdit(index, noteDetails.id)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
