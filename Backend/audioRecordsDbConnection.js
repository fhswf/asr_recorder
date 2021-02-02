const mongoClient = require('mongodb').MongoClient;
const urlMongoDb = "mongodb://localhost:27017/audioRecords"
const dbNameAudioRecords = "audioRecords";
const dbNameTextes = "textesCollection";
const collectionNameAudio = "audioRecordsCollection";
const collectionNameTextes = "textCollection";


class audioRecordsDbConnection
{
    constructor()
    {
        //super()
        mongoClient.connect(urlMongoDb, function(err, db)
        {
            if (err)
            {
                console.log(err);
            }
            console.log("Database created!");
            //create collection (table) for audio files (if not existing)
            var dbo = db.db(dbNameAudioRecords);
            dbo.createCollection(collectionNameAudio, function(err, res)
            {
                if (err) console.log(err);
                console.log("Collection for Audios created!");
                db.close();
            });
            //create collection (table) for textes (if not existing)
            dbo.createCollection(collectionNameTextes, function(err, res)
            {
                if (err) console.log(err);
                console.log("Collection for Textes created!");
                db.close();
            });
        });
    }

    writeEntryAudio(dataForDbEntry)
    {
        mongoClient.connect(urlMongoDb, function(err, db) 
        {
            if (err) throw err;
            var dbo = db.db(dbNameAudioRecords);

            dbo.collection(collectionNameAudio).insertOne(dataForDbEntry, function(err, res) 
            {
                if (err) throw err;
                console.log("file inserted");
                db.close();
            });
        })
    }

    async readAllTextEntries(_callback)
    {
        mongoClient.connect(urlMongoDb,async function(err, db) 
        {
            if (err) throw err;
            var dbo = db.db(dbNameTextes);

            dbo.collection(collectionNameTextes).find({},{text: 1, _id: 0}).toArray(async function(err, result)
            {
                if (err) throw err;
                console.log(result);
                let returnedArray = []
                result.forEach(element => returnedArray.push(element.text));
                db.close();
                _callback(returnedArray);
            })
        })
    }


}

module.exports = new audioRecordsDbConnection();
