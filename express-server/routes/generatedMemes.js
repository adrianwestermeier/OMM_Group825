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

function getMemesFromDb(){
    console.log('get memes from DB');
    mongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("meme-generator-db");
        // var query = { name: "Drake Hotline Bling" };
        dbo.collection("generatedMemes").find().toArray(function(err, result) {
            if (err) throw err;
            /* console.log(result); */
            memes = result;
            db.close();
        });
    });
    console.log('memes ' + memes);
}

function updateMeme(reqBody){
    /*mongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let dbo = db.db("meme-generator-db");
        dbo.collection("generatedMemes").findOneAndUpdate(
            {_id: req.body.id},
            {
                $set: {
                    "upVotes": req.body.upVotes,
                    "downVotes": req.body.downVotes
                }
            },
            {upsert: false}
        )
            .then(result => {
                console.log(result)
            })
            .catch(error => console.error(error))
    });*/

    /*memesCollection.findOneAndUpdate(
                {_id: req.body.id},
                {
                    $set: {
                        "upVotes": req.body.upVotes,
                        "downVotes": req.body.downVotes
                    }
                },
                {upsert: false}
            )
                .then(result => {
                    console.log(result)
                })
                .catch(error => console.error(error))*/
}


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
        "name": req.body.name,
        "url": req.body.url,
        "width": req.body.width,
        "height": req.body.height,
        "top_caption": req.body.top_caption,
        "middle_caption": req.body.middle_caption,
        "bottom_caption": req.body.bottom_caption,
        "upVotes": req.body.upVotes,
        "downVotes": req.body.downVotes

    };

    // TODO: evtl. hier auf leere Felder prüfen

    postMemeToDb(generatedMeme);
    res.json({
        "code": 201,
        "message": "saved meme successfully, refresh page to see changes.",
        "image": [generatedMeme]
    });
    getMemesFromDb();
})

getMemesFromDb();

router.get('/getMemes', function(req, res, next) {
    console.log('hallo');
    console.log('router.get /getMemes');


    /* console.log(images); */
    res.json({
        "memes": memes
    });
    console.log('sent');
});

// das Update funktioniert gerade nur über die Namen. ich kann nciht auf _id zugreifen. Wir bauchen also eine Möglichkeit Memes eindeutig zu identifizieren.
router.put('/updateMeme', function (req, res){
    mongoClient.connect(url, function(err, db) {
        console.log('Verbindung aufgebaut')
        if (err) throw err;
        //let id = "ObjectId(\"" + req.body.id + "\")"
        //console.log(id)
        let dbo = db.db("meme-generator-db");
        dbo.collection("generatedMemes").findOneAndUpdate(
            {name: req.body.name},
            {
                $set: {
                    "upVotes": req.body.upVotes,
                    "downVotes": req.body.downVotes
                }
            },
            {upsert: false}
        )
            .then(result => {
                console.log(result)
            })
            .catch(error => console.error(error))
    })
    getMemesFromDb()
});

module.exports = router;