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
    mongoClient.connect(url, function(err, db) {
        if (err) throw err;
        const dbo = db.db("meme-generator-db");
        dbo.collection("generatedMemes").find().toArray(function(err, result) {
            if (err) throw err;
            memes = result;
            db.close();
        });
    });
    console.log('memes ' + memes);
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

// TODO: Adrian, das stimmt so nicht mehr oder? wo wird das das meme gespeichert so wie es jetzt ausscheut und was müssen wir hier noch ändern?
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

    postMemeToDb(generatedMeme);
    res.json({
        "code": 201,
        "message": "saved meme successfully, refresh page to see changes.",
        "image": [generatedMeme]
    });
    getMemesFromDb();
})

getMemesFromDb();


/* Function to retrieve names of existing memes which are hosted static*/
router.get('/getMemes', function(req, res, next) {
    console.log('[generatedMemes] getMemes');

    let memes = [];
    console.log('get meme name from Db');
    mongoClient.connect(url, function(err, db) {
      if (err) throw err;
      const dbo = db.db("meme-generator-db");
      dbo.collection("generatedMemes").find().toArray(function(err, result) {
        if (err) throw err;
        
        result.forEach(el => {
          memes.push(el.name);
        })
        console.log('data to send from db: ' + memes);
        res.json({
          "memes": memes
        });
        db.close();
      });
    }); 
    console.log('sent memes');
});

/* GET meme data. */
router.get('/getMemeData', function(req, res, next) {
    let memes = [];
    console.log('[generatedMemes] get meme data from Db');
    mongoClient.connect(url, function(err, db) {
      if (err) throw err;
      const dbo = db.db("meme-generator-db");
      dbo.collection("generatedMemes").find().toArray(function(err, result) {
        if (err) throw err;
        result.forEach(el => {
            const nextMeme = {
                name: el.name,
                title: el.title,
                upVotes: el.upVotes,
                downVotes: el.downVotes
            }
          memes.push(nextMeme);
        })
        console.log('data to send from db: ' + memes);
        res.json({
          "memes": memes
        });
        db.close();
      });
    }); 
    console.log('sent memes');
});

// das Update funktioniert gerade nur über die Namen. ich kann nciht auf _id zugreifen. Wir bauchen also eine Möglichkeit Memes eindeutig zu identifizieren.
router.put('/updateMeme', function (req, res){
    mongoClient.connect(url, function(err, db) {
        console.log('Verbindung aufgebaut')
        if (err) throw err;

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
                res.json({
                    "code": 201,
                    "message": "updated meme successfully, refresh page to see changes.",
                });
            })
            .catch(error => console.error(error))
    })

});

module.exports = router;