const notes = require("express").Router();

const uuid = require("../Helpers/uuid");
const {
  readAndAppend,
  readFromFile,
  writeToFile,
} = require("../Helpers/fsUtils");

// Get route to get all notes
notes.get("/", (req, res) =>
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)))
);

// Get route for a single note
notes.get("/:note_id", (req, res) => {
  const noteId = req.params.note_id;
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.note_id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json("Invalid note ID: There was no note found with that ID");
    });
});

// Post Route for new note
notes.post("/", (req, res) => {
  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title: title,
      text: text,
      note_id: uuid(),
    };

    readAndAppend(newNote, "./db/db.json");
    res.json(`Note added!`);
  } else {
    res.error("There was an error in posting your note.");
  }
});

// Delete Route
notes.delete("/:note_id", (req, res) => {
  const noteId = req.params.note_id;
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.note_id !== noteId);
      writeToFile("./db/db.json", result);
      res.json(`The note had been deleted.`);
    });
});

module.exports = notes;
