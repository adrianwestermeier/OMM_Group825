let express = require('express');
let fs = require("fs"), json;
let router = express.Router();
let cors = require('cors');

let corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200,
    methods: "GET, PUT"
}

/* GET meme data. */
router.get('/getMemeData', function(req, res, next) {
    console.log('[generatedMemes] get meme data from Db');

    let myMemes = [];
    const db = req.db;
    const generatedMemes = db.get('generatedMemes');
    generatedMemes.find({}).then((memes) => {
      memes.forEach(el => {
        const nextMeme = {
            name: el.name,
            title: el.title,
            template: el.template,
            date: el.date,
            user: el.user,
            upVotes: el.upVotes,
            downVotes: el.downVotes,
            upMinusDownVotes: el.upMinusDownVotes,
            isPrivate: el.isPrivate,
            comments: el.comments
        }
        myMemes.push(nextMeme);
      })
      console.log('data to send from db: ' + myMemes);
      res.json({
        "memes": myMemes
      });
    })
    console.log('sent memes');
});

// das Update funktioniert gerade nur über eindeutigen Namen.
router.put('/updateMeme', function (req, res){
    const db = req.db;
    const generatedMemes = db.get('generatedMemes');
    generatedMemes.findOneAndUpdate(
      {name: req.body.name},
      {
        $set: {
          "upVotes": req.body.upVotes,
          "downVotes": req.body.downVotes,
          "upMinusDownVotes": req.body.upMinusDownVotes,
          "comments": req.body.comments
        }
      })
      .then((result) => {
        console.log(result)
        res.json({
            "code": 201,
            "message": "updated meme successfully, refresh page to see changes.",
        });
      })
      .catch(error => console.error(error))
});

module.exports = router;