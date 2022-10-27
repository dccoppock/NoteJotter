const util = require('util');
const fs = require('fs');

const uuid = require('uuid/v4');

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
        return writeStorage('db/db.json', JSON.stringify(jot));
    }

    addNoteId(title, text) {
        const newId = uuid();
        return { title, text, id: newId };
    }

    storeNote(note) {
        const { title, text } = note;
        if(title && text) {
            const newNote = addNoteId(title,text);
            return this.getAllNotes()
                .then((allNotes) => allNotes.push(newNote))
                .then((allNotes) => this.write(allNotes))
                .then(() => newNote);
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
            .then((survivingNotes) => this.write(survivingNotes))
            .then((survivingNotes) => survivingNotes;
    }
}

module.exports = new Storage();