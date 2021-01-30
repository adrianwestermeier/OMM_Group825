var express = require('express');
var fs = require("fs"), json;
var router = express.Router();
var cors = require('cors');
var mongoClient = require('mongodb').MongoClient;
var jimp = require('jimp');

var corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200,
  methods: "GET, PUT"
}

var url = "mongodb://localhost:27017/";

var images;

function getImagesFromDb() {
  console.log('get Image from Db');
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

/* GET local images. */
router.get('/localfiles', function (req, res, next) {
  mongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("meme-generator-db");
    // var query = { name: "Drake Hotline Bling" };
    dbo.collection("localImages").find().toArray(function(err, result) {
      if (err) throw err;
      /* console.log(result); */
      result.forEach((item) => {
        console.log(item);
        var options = {
          root: path.join(__dirname, 'public'),
          dotfiles: 'deny',
          headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
          }
        }
      
        var fileName = item.name;
        console.log(fileName);
        res.sendFile(fileName, options, function (err) {
          if (err) {
            next(err)
          } else {
            console.log('Sent:', fileName)
          }
        })
      })
      db.close();
    });
  }); 
  
})
  
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


router.post('/saveCreatedMeme', function(req, res) {
  var base64Data = req.body.img.replace(/^data:image\/png;base64,/, "");
  console.log(base64Data);

  fs.writeFile("./public/memes/out.png", base64Data, 'base64', function(err) {
    if (err) {
      console.log('error in saving');
      return res.status(500).send(err);
    }

    // TODO: load images from local files
    res.json({
      "code": 201,
      "message": "saved image on server",
    });
  });
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


// helper function for printing one text to image
async function jimper(data, text, name, top, path) {
	// Read the image
  const image = await jimp.read( Buffer.from(data, 'base64') );

  // Load the font
  const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);

  let w = image.bitmap.width; //  width of the image
  let h = image.bitmap.height;

  if(top) {
    // Print text to image
    await image.print(
      font,
      0,
      0,
      {
        text: text,
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_TOP
      },
      w,
      h
      );
  } else {
    // Print text to image
    await image.print(
      font,
      0,
      0,
      {
        text: text,
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
      },
      w,
      h
      );
  }
  
  // Save the image
  try {
    if (fs.existsSync(path)) {
      console.log("file exists");
      return "fail";
      //file exists
    } else {
      await image.writeAsync(path);
      return "success";
    }
  } catch(err) {
    console.error(err)
  }
	
}

// TODO: helper function for printing multiple texts to image
async function jimperExtended(data, topText, bottomText, topX, topY, bottomX, bottomY) {
	// Read the image
  const image = await jimp.read( Buffer.from(data, 'base64') );

  // Load the font
  const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);

  await image.print(font, topX, topY, topText);
  await image.print(font, bottomX, bottomY, bottomText);
  
	// Save the image
	await image.writeAsync('./public/memes/image.png');
}

router.post('/createMemeTop', function(req, res) {
  var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
  const text = req.body.text;
  const name = req.body.name;
  const path = './public/memes/' + name + '.png';
  
  let imageBuffer = Buffer.from(base64Data);
  console.log(imageBuffer);

  jimper(base64Data, text, name, true, path).then((result)=>{
    if(result === "success") {
      res.json({
        "code": 201,
        "message": "saved image on server, get the meme under http://localhost:3005/images/" + name + '.png',
      });
    } else {
      res.json({
        "code": 501,
        "message": "A meme with this name already exists",
      });
    }
  })
})

router.post('/createMemeBottom', function(req, res) {
  var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
  const text = req.body.text;
  const name = req.body.name;
  const path = './public/memes/' + name + '.png';
  
  let imageBuffer = Buffer.from(base64Data);
  console.log(imageBuffer);

  jimper(base64Data, text, name, false, path).then(()=>{
    if(result === "success") {
      res.json({
        "code": 201,
        "message": "saved image on server, get the meme under http://localhost:3005/images/" + name + '.png',
      });
    } else {
      res.json({
        "code": 501,
        "message": "A meme with this name already exists",
      });
    }
  })
})


//TODO
router.post('/createMemeTopBottom', function(req, res) {
  var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
  const text = req.body.text;
  let posX;
  let posY;
  if(req.body.positionX && req.body.positionY) {
    posX = req.body.positionX;
    posY = req.body.positionY;
  }
  
  let imageBuffer = Buffer.from(base64Data);
  console.log(imageBuffer);

  jimper(base64Data, text, posX, posY).then(()=>{
    res.json({
          "code": 201,
          "message": "saved image on server",
    });
  })
})

module.exports = router;