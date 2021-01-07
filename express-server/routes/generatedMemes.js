let express = require('express');
let fs = require("fs"), json;
let router = express.Router();
let cors = require('cors');
let mongoClient = require('mongodb').MongoClient;

let corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200,
    methods: "GET, PUT"
}

let url = "mongodb://localhost:27017/";

let memes;


function postMemeToDb(generatedMeme) {
    mongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("meme-generator-db");
        // var query = { name: "Drake Hotline Bling" };
        dbo.collection("generatedMemes").insertOne(generatedMeme, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
}

router.post( "/uploadGeneratedMeme", function (req, res) {
    console.log('got post request ', req.body);
    let generatedMeme = {
        "name": "name",
        "url": "url",
        "width": 100,
        "height": 100,
        "top_caption": "topCaption",
        "middle_caption": "middleCaption",
        "bottom_caption": "bottomCaption"

    };

    // TODO: hier muss ich weiter machen

})

module.exports = router;