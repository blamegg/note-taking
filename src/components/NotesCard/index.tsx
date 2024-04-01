import Button from "@mui/material/Button";

export const NotesCard = ({ noteDetails, deleteNote, updatePin }) => {
  return (
    <div className="p-4 border border-black rounded-lg">
      <h4 className="text-xl font-bold">
        Title: {noteDetails.title} {noteDetails.pin ? "pinned" : null}
      </h4>
      <p className="text-base">{noteDetails.description}</p>
      <div className="flex gap-2">
        <Button variant="contained" onClick={() => deleteNote(noteDetails.id)}>
          delete
        </Button>
        <Button onClick={() => updatePin(noteDetails.id)} variant="contained">
          pin
        </Button>
      </div>
    </div>
  );
};
