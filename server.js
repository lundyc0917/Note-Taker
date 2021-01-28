const express = require('express');
const path = require('path');
const fs = require('fs');

// create the express server
const app = express();

// Set inital port to 8080.
const PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

// get /notes page
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// send notes data
app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./db/db.json"));
});

// get info from notes
app.get("/api/notes/:id", function(req, res) {
    let storedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(storedNotes[Number(req.params.id)]);
});

// get default page
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// post note data
app.post("/api/notes", function(req, res) {
    let storedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body
    let noteID = (storedNotes.length).toString();

    newNote.id = noteID;

    storedNotes.push(newNote)
    fs.writeFile("./db/db.json", JSON.stringify(storedNotes), function(){
        res.json(storedNotes);
    });
});

app.delete("/api/notes/:id", function(req, res) {
    let storedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let deleteID = req.params.id;

    for (var i=0; i< storedNotes.length; i++){
        if (deleteID == storedNotes[i].id){
            storedNotes.splice(i, 1);

            fs.writeFile("./db/db.json", JSON.stringify(storedNotes), function(err){
                if (err){
                    console.log(err)
                }                    
                res.json(storedNotes)
            });
        }
    }
});

app.listen(PORT, function(){
    console.log("Listening to port "+PORT);
});