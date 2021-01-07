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
        let dbo = db.db("meme-generator-db");
        dbo.collection("generatedMemes").insertOne(generatedMeme, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
}

router.post( "/uploadGeneratedMeme", function (req, res) {
    console.log('got post request (generatedMeme) ', req.body);
    let generatedMeme = {
        "name": "name",
        "url": "url",
        "width": 100,
        "height": 100,
        "top_caption": "topCaption",
        "middle_caption": "middleCaption",
        "bottom_caption": "bottomCaption"

    };

    // TODO: evtl. hier auf leere Felder prüfen

    postMemeToDb(generatedMeme);
    res.json({
        "code": 201,
        "message": "saved meme successfully, refresh page to see changes.",
        "image": [generatedMeme]
    });

})

module.exports = router;