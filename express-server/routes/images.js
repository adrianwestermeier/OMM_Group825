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

function assertNewDbEntry(entry) {
  if (entry.name==="" || entry.url==="" || entry.width==="" || entry.height==="" || entry.boxCount==="") {
      console.log('empty string detected');
      return 0;
  }
  return 1;
}

function postImageToDb(image) {
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
  console.log('got post request ', req.body);
  var newImage = {
    "name": req.body.name,
    "url": req.body.url,
    "width": req.body.width,
    "height": req.body.height,
    "box_count": req.body.boxCount
  };
  if (assertNewDbEntry(newImage) == 0) {
    res.json({
      "code": 401,
      "message": "creation failed, no empty fields allowed!"
    });
  } else {
    postImageToDb(newImage);
    res.json({
      "code": 201,
      "message": "created image successfully, refresh page to see changes.",
      "image": [newImage]
    });
  }
  
  // update the data instantly
  getImagesFromDb();
})


router.post('/upload', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log('err1');
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "userUploadFile") is used to retrieve the uploaded file
  let sampleFile = req.files.userUploadFile;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('../../filename.jpg', function(err) {
    if (err) {
      console.log('error in upload 500');
      return res.status(500).send(err);
    }

    // TODO: load images from local files
    res.json({
      "code": 201,
      "message": "TODO in Backend: load from local files",
    });
  });
});

module.exports = router;