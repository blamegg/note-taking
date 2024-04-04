"use client";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

interface INotesCard {
  noteDetails: any;
  deleteNote: any;
  updatePin: any;
  onEdit: any;
  edit: number | null;
  setEdit: any;
  index: number;
  handleChange: any;
  onSave: any;
}

export const NotesCard = ({
  noteDetails,
  deleteNote,
  updatePin,
  onEdit,
  edit,
  setEdit,
  index,
  handleChange,
  onSave,
}: INotesCard) => {
  return (
    <div className="border-2 border-gray-300 rounded-lg p-5 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-2xl font-bold text-gray-800">
          Title: {noteDetails.title}
        </h5>
        {noteDetails.pin && (
          <span className="text-sm font-bold text-yellow-500">Pinned</span>
        )}
      </div>
      <p className="text-gray-600 mb-4">
        Description: {noteDetails.description}
      </p>
      <div className="flex gap-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          onClick={() => deleteNote(noteDetails.id)}
        >
          Delete
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={() => updatePin(noteDetails.id)}
        >
          {noteDetails.pin ? "Unpin" : "Pin"}
        </button>
      </div>
    </div>
  );
};

{
  /* <div className="p-4 border border-black rounded-lg">
{edit === index ? (
  <TextField
    id="outlined-basic"
    label="Outlined"
    variant="outlined"
    name="title"
    onChange={handleChange}
  />
) : (
  <h4 className="text-xl font-bold">
    Title: {noteDetails.data.title}{" "}
    {noteDetails.data.pin ? "pinned" : null}
  </h4>
)}
{edit === index ? (
  <TextField
    id="outlined-basic"
    label="Outlined"
    variant="outlined"
    name="description"
    onChange={handleChange}
  />
) : (
  <p className="text-base">{noteDetails.data.description}</p>
)}

<div className="flex gap-2">
  <Button
    variant="contained"
    onClick={() => deleteNote(noteDetails.data.id)}
  >
    delete
  </Button>
  <Button
    onClick={() => updatePin(noteDetails.data.id)}
    variant="contained"
  >
    pin
  </Button>
  {edit === index ? (
    <Button
      onClick={() => onSave(noteDetails.data.id)}
      variant="contained"
    >
      save
    </Button>
  ) : (
    <Button onClick={() => onEdit(index)} variant="contained">
      edit
    </Button>
  )}
</div>
</div> */
}
