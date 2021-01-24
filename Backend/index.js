const express = require('express');
const bodyParser = require('body-parser');
const upload = require('multer')();
const cors = require('cors'); //TODO: Currently not working (no reaction at post)
const fs = require('fs'); //for testing purposes
const conn = require('./audioRecordsDbConnection');
// const mongoClient = require('mongodb').MongoClient;
// const urlMongoDb = "mongodb://localhost:27017/audioRecords"
// const dbName = "audioRecords";
// const collectionName = "audioRecordsCollection"

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

//create database

// mongoClient.connect(urlMongoDb, function(err, db)
//   {
//     if (err)
//     {
//         console.log(err);
//     }
//     console.log("Database created!");
//     //create collection (table)
//     var dbo = db.db(dbName);
//     dbo.createCollection(collectionName, function(err, res)
//     {
//         if (err) console.log(err);
//         console.log("Collection created!");
//         db.close();
//     });
//   });

// Route definieren
//TODO: brauch man router? let router = express.Router({mergeParams: true});
app.post('/asrRecorder/uploadAudio', upload.single('file'),(req, res, next) => 
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
    // write received meta-Informations in MongoDB (for testing)

    // mongoClient.connect(urlMongoDb, function(err, db) 
    // {
    //   if (err) throw err;
    //   var dbo = db.db(dbName);

    //   dbo.collection(collectionName).insertOne(dataForDbEntry, function(err, res) 
    //   {
    //     if (err) throw err;
    //     console.log("file inserted");
    //     db.close();
    //   });
    // })

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