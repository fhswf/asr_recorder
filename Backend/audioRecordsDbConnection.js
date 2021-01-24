const mongoClient = require('mongodb').MongoClient;
const urlMongoDb = "mongodb://localhost:27017/audioRecords"
const dbName = "audioRecords";
const collectionName = "audioRecordsCollection"


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
            //create collection (table)
            var dbo = db.db(dbName);
            dbo.createCollection(collectionName, function(err, res)
            {
                if (err) console.log(err);
                console.log("Collection created!");
                db.close();
            });
        });
    }

    writeEntry(dataForDbEntry)
    {
        mongoClient.connect(urlMongoDb, function(err, db) 
        {
            if (err) throw err;
            var dbo = db.db(dbName);

            dbo.collection(collectionName).insertOne(dataForDbEntry, function(err, res) 
            {
                if (err) throw err;
                console.log("file inserted");
                db.close();
            });
        })
    }

}

module.exports = new audioRecordsDbConnection();
