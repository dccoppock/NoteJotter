const router = require('express').Router();
const storage = require('../db/storage');

// GET /api/notes - respond with all notes in database
router.get('/notes', (req, res) => {
    storage
        .getAllNotes().then((allNotes) => { res.json(allNotes) } )
        .catch((err) => res.status(500).json(err));
});

// POST /notes - add new note to database and respond with the new note (with added uuid)
router.post('/notes', (req, res) => {
    storage.storeNote(req.body)
        .then((newNote)  => res.json(newNote))
        .catch((err) => res.status(500).json(err));
});

// DELETE /api/notes/:id - remove note with id matching ':id'
router.delete('/notes/:id', (req, res) => {
    storage
        .deleteNote(req.params.id)
        .then((note) => res.json(note))
        .catch((err) => res.status(500).json(err));
});

module.exports = router;