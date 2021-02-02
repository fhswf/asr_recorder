const express = require('express');
const bodyParser = require('body-parser');
const upload = require('multer')(); // Multer middleware importieren
const cors = require('cors'); //TODO: Currently not working (no reaction at post)
const fs = require('fs'); //for testing purposes
const conn = require('./audioRecordsDbConnection'); //Also Creates Mongo-DB-Collection

const port = 9000;
const app = express({mergeParams: true});

app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(cors()) 

// enable Cors for origins
app.options('/asrRecorder/getTextes',cors())
app.options('/asrRecorder/uploadAudio',cors())

app.get('/asrRecorder/getTextes',cors(), async (req, res, next) => 
{
    conn.readAllTextEntries((textesArray) =>
    {
        console.log(textesArray);
        res.json({"textes": textesArray});
    })
});

app.post('/asrRecorder/uploadAudio',cors(), upload.single('file'), async (req, res, next) => 
  {
    // Optionale JSON Daten auslesen
    let metadataAudio = JSON.parse(req.body.metadataAudio);
    // Blob Datei auslesen
    let myFile = req.file;
    // write file in file-System for testing purposes
    fs.writeFile("./tmp/test.wav", myFile.buffer, function(err) 
    {
      if(err) 
      {
          return console.log(err);
      }
      console.log("The file was saved!");
    }); 
    
    //Merge metadata for audiofile and audiofile itself
    let dataForDbEntry = {...metadataAudio, ...myFile};
    console.log(dataForDbEntry);
    conn.writeEntryAudio(dataForDbEntry);
    res.json(req.body.metadataAudio);
  });

  app.listen(port, () => 
    {
        console.log('Running http://localhost:9000')
    }
);

// ExpressJS Einstellungen

//import {removePausesAndAddPadding,toBuffer,toWav, SILENCE_LEVEL} from './removeSilence'
    //get file without silent passages
    // const output = await removePausesAndAddPadding(myFile, SILENCE_LEVEL)
    // const outputBuffer = toBuffer(toWav(output));
    // myFile.buffer = outputBuffer;