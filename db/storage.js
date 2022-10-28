const util = require('util');
const fs = require('fs');

const { v1: uuidv1 } = require('uuid');

const readStorage = util.promisify(fs.readFile);
const writeStorage = util.promisify(fs.writeFile);



class Storage {
    read() {
        return readStorage('db/db.json', 'utf8');
    }

    getAllNotes() {
        return this.read()
        .then((noteJSONs) => {
            let noteObjects = [];
            try { noteObjects = noteObjects.concat(JSON.parse(noteJSONs)); }
            catch (err) { noteObjects = []; console.error(err); }
            return noteObjects;
        });
    }

    write(note) {
        return writeStorage('db/db.json', JSON.stringify(note));
    }

    storeNote(note) {
        // Function to add unique id to note object
        function addNoteId(title, text) {
            const newId = uuidv1();
            return { title, text, id: newId };
        }
        const { title, text } = note;
        if(title && text) {
            const newNote = addNoteId(title,text);
            return this.getAllNotes()
                .then((allNotes) => allNotes.concat(newNote))
                .then((note) => this.write( note ))
                .then(() => newNote)
                .catch((err) => ({failure: err}));
        } else {
            return { status: 'ERROR: title and text cannot be blank' };
        }
    }

    deleteNote(targetId) {
        // Function for use with .filter(); returns false if ids match
        function idsMatch(note) {
            return (note.id !== targetId);
        }
        // Get all notes, remove note(s) with id===targetId, store new ntoes list, return new notes list
        return this.getAllNotes()
            .then((allNotes) => allNotes.filter(idsMatch))
            .then((note) => this.write(note))
            .then((survivingNotes) => survivingNotes);
    }
}

module.exports = new Storage();