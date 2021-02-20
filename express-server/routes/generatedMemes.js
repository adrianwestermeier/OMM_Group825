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
                user: el.user,
                upVotes: el.upVotes,
                downVotes: el.downVotes,
                upMinusDownVotes: el.upMinusDownVotes
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
                    "downVotes": req.body.downVotes,
                    "upMinusDownVotes": req.body.upMinusDownVotes
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