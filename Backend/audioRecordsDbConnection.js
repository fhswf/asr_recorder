const mongoClient = require('mongodb').MongoClient;
const urlMongoDb = "mongodb://localhost:27017/audioRecords"
const dbName = "audioRecords";
const collectionNameAudio = "audioRecordsCollection"
const collectionNameTextes = "textesCollection"


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
            var dbo = db.db(dbName);
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
            var dbo = db.db(dbName);

            dbo.collection(collectionNameAudio).insertOne(dataForDbEntry, function(err, res) 
            {
                if (err) throw err;
                console.log("file inserted");
                db.close();
            });
        })
    }

}

module.exports = new audioRecordsDbConnection();
