const express = require('express');
const bodyParser = require('body-parser');
const upload = require('multer')();
const cors = require('cors'); //TODO: Currently not working (no reaction at post)
const fs = require('fs'); //for testing purposes
const conn = require('./audioRecordsDbConnection'); //Also Creates Mongo-DB-Collection

const port = 9000;

const app = express({mergeParams: true});

app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
//app.use(cors); //TODO: Currently not working (no reaction at post)
// Multer middleware importieren

app.listen(port, () => 
    {
        console.log('Running http://localhost:9000')
    }
);

// Route definieren
app.post('/asrRecorder/uploadAudio', upload.single('file'),async (req, res, next) => 
  {
    console.log(req,req.body);
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
    conn.writeEntry(dataForDbEntry);

    res.json(req.body.zuSendeneFormulardaten);

  });

// const express = require("express")
// const bodyParser = require('body-parser')
// const cors = require('cors')
// const app = express()

// const port = 9000;

// //necessary for getting the response of the sent post request from frontend (from browser)
// app.use(cors())

// app.listen(port, () => 
//     {
//         console.log('Beispiel http://localhost:${port}')
//     }
// );

// app.use(bodyParser.json());
// //for accessing POST-Arguments more easily
// app.use(express.urlencoded(
//     {
//         extended: true
//     }
// ));


// app.post('/bar', function(req, res)
//     {
//         console.log(req,req.body);
//         res.setHeader("ContentType", "application/json");
//         res.json({"bar" : req.body.foo});
//     }
// )

// ExpressJS Einstellungen

//import {removePausesAndAddPadding,toBuffer,toWav, SILENCE_LEVEL} from './removeSilence'
    //get file without silent passages
    // const output = await removePausesAndAddPadding(myFile, SILENCE_LEVEL)
    // const outputBuffer = toBuffer(toWav(output));
    // myFile.buffer = outputBuffer;