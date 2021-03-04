const express = require('express');
const bodyParser = require('body-parser');
const upload = require('multer')(); // Multer middleware importieren
const cors = require('cors');
const conn = require('./audioRecordsDbConnection'); //Also Creates Mongo-DB-Collection
require('dotenv').config();

const port = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));

//http-Get restful-Interface for getting an array of textes in json from the MongoDB
app.get(process.env.ROOTPATH + 'getTextes',cors(), async (req, res, next) => 
{
    conn.readAllTextEntries((textesArray) =>
    {
        console.log(textesArray);
        res.json({"textes": textesArray});
    })
});

//http-post restful-inteface for saving one Audio file in the MongoDB as json
app.post(process.env.ROOTPATH + 'uploadAudio',cors(), upload.single('file'), async (req, res, next) => 
  {
    // Read Metadata
    let metadataAudio = JSON.parse(req.body.metadataAudio);
    // Read Blob-File data
    let myFile = req.file;
    //Merge metadata for audiofile and audiofile itself
    let dataForDbEntry = {...metadataAudio, ...myFile};
    //Write entry in Database
    conn.writeEntryAudio(dataForDbEntry);
    //send response as confirmation
    res.json({status: "OK"});
  });

  app.listen(port, () => 
    {
        console.log('Server is running')
    }
);
