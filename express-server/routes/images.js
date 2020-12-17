var express = require('express');
var fs = require("fs"), json;
var router = express.Router();
var cors = require('cors');
var mongoClient = require('mongodb').MongoClient;

var corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200,
  methods: "GET, PUT"
}

var url = "mongodb://localhost:27017/";

var images;

function getImagesFromDb() {
  mongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("meme-generator-db");
    // var query = { name: "Drake Hotline Bling" };
    dbo.collection("images").find().toArray(function(err, result) {
      if (err) throw err;
      /* console.log(result); */
      images = result;
      db.close();
    });
  }); 
}

function postImagesToDb(image) {
  mongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("meme-generator-db");
    // var query = { name: "Drake Hotline Bling" };
    dbo.collection("images").insertOne(image, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  }); 
}

function readJsonFileSync(filepath, encoding){

    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

function getData(file){

    var filepath = __dirname + '/' + file;
    console.log(filepath);
    return readJsonFileSync(filepath);
}


/* var imagesJson = getData('imagesDatabase.json'); */
// const images = imagesJson;
  
getImagesFromDb();

/* GET images. */
router.get('/', function(req, res, next) {
    console.log('in images');
    /* console.log(images); */
    res.json({
        "images": images
    });
    console.log('sent');
});
  
  /* POST image. */
  router.post('/handle', function(req, res, next) {
    console.log('in post');
    var newImage = {
      "name": req.body.name
    }
      /* console.log('got post request ', req.body);
      var newImage = {
        "name": req.body.name,
        "url": req.body.url,
        "width": req.body.width,
        "height": req.body.height,
        "box_count": req.body.boxCount
      };

    postImagesToDb(newImage); */
  
    res.json({
      "code": 201,
      "message": "created image",
      "image": [newImage]
    });
    
    /* getImagesFromDb(); */
  });

module.exports = router;