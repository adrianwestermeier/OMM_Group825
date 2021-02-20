var express = require('express');
var fs = require("fs"), json;
var router = express.Router();
const axios = require('axios');
var cors = require('cors');
var jimp = require('jimp');
const { title } = require('process');
var database = require('./database');

var corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200,
  methods: "GET, PUT"
}

// var url = "mongodb://localhost:27017/";

// var images;

// ----------- Helper Functions ------------

/* returns all images from "images" collection */
// function getImagesFromDb() {
//   console.log('[images] get Image from Db');
//   mongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("meme-generator-db");
//     dbo.collection("images").find().toArray(function(err, result) {
//       if (err) throw err;
//       images = result;
//       db.close();
//     });
//   }); 
// }

/* checks if all fields are present */
// function assertNewDbEntry(entry) {
//   if (entry.name==="" || entry.url==="" || entry.width==="" || entry.height==="" || entry.boxCount==="") {
//       console.log('[images] empty string detected');
//       return 0;
//   }
//   return 1;
// }

/* posts a new meme to the images collections */
// function postImageToDb(image) {
//   mongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("meme-generator-db");
//     dbo.collection("images").insertOne(image, function(err, res) {
//       if (err) throw err;
//       console.log("[images] 1 document inserted");
//       db.close();
//     });
//   }); 
// }



/* reads a file and parses it to json */
// function readJsonFileSync(filepath, encoding){

//     if (typeof (encoding) == 'undefined'){
//         encoding = 'utf8';
//     }
//     var file = fs.readFileSync(filepath, encoding);
//     return JSON.parse(file);
// }

// function getData(file){
//     var filepath = __dirname + '/' + file;
//     console.log(filepath);
//     return readJsonFileSync(filepath);
// }
  
// getImagesFromDb();

// ----------- HTTP Functions ------------

/* GET local images. */
// router.get('/localfiles', function (req, res, next) {
//   mongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("meme-generator-db");
//     dbo.collection("localImages").find().toArray(function(err, result) {
//       if (err) throw err;
//       result.forEach((item) => {
//         console.log('[images] ' + item);
//         var options = {
//           root: path.join(__dirname, 'public'),
//           dotfiles: 'deny',
//           headers: {
//             'x-timestamp': Date.now(),
//             'x-sent': true
//           }
//         }
      
//         var fileName = item.name;
//         console.log(fileName);
//         res.sendFile(fileName, options, function (err) {
//           if (err) {
//             next(err)
//           } else {
//             console.log('[images] Sent:', fileName)
//           }
//         })
//       })
//       db.close();
//     });
//   }); 
  
// })

/* helper for downloading by url */
const download_image = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );
  
/* TODO: download image and create a new db entry */
router.post('/createByUrl', function(req, res, next) {
  console.log('[images] create by url ', req.body);
  const db = req.db;
  
  // e.g. https://i.imgflip.com/24y43o.jpg
  const name = req.body.name;
  const templateUrl = req.body.url;

  let format;
  if(templateUrl.includes("jpg")) {
    format = ".jpg";
  } else if(templateUrl.includes("png")) {
    format = ".png";
  } else {
    return;
  }

  const path = './public/templates/' + name + format;

  database.getEntry(db, name, 'templates').then((entry) => {
    if(entry) {
      console.log("[images] entry: " + entry);
      res.json({
        "code": 501,
        "message": "template with name \"" + name + "\" already exists! Please rename your file.",
      });
    } else {
      console.log("[images] no entry yet");

      download_image(templateUrl, path).then(() => {
        console.log("[images] downloaded by url");
        var newTemplate = {
          "name": name + format,
        };
      
        database.postTemplateToDb(db, newTemplate).then(() => {
          console.log("[images] wrote new template to DB");
          res.json({
            "code": 201,
            "message": "Added template successfully!",
          });
        });
      })
      
    }
  })
 
})


/* save a created meme */
router.post('/saveCreatedMeme', function(req, res) {
  const db = req.db;
  const base64Data = req.body.img.replace(/^data:image\/png;base64,/, "");
  // console.log(base64Data);
  const name = req.body.name + '.png';
  const title = req.body.title;
  const user = req.body.user;
  const dir = "./public/memes/" + name;

  database.getEntry(db, name, 'generatedMemes').then((entry) => {
    if(entry) {
      console.log("[images] entry: " + entry);
      res.json({
        "code": 501,
        "message": "meme with name \"" + name + "\" already exists! Please rename your meme.",
      });
    } else {
      console.log("[images] no entry");
      
      fs.writeFile(dir, base64Data, 'base64', function(err) {
        if (err) {
          console.log('error in saving');
          return res.status(500).send(err);
        }

        const newMeme = {
          "name": name,
          "title": title,
          "user": user,
          "upVotes": 0,
          "downVotes": 0,
          "upMinusDownVotes": [0]
        };

        console.log(newMeme);
      
        database.postNewMemeToDb(db, newMeme).then(() => {
          console.log("[images] wrote new meme to DB");
          res.json({
            "code": 201,
            "message": "saved meme on server",
          });
        });
      });
    }
  });
})

/* save a created meme */
router.post('/saveTemplateSnapshot', function(req, res) {
  const db = req.db;
  const base64Data = req.body.img.replace(/^data:image\/png;base64,/, "");
  // console.log(base64Data);
  const name = req.body.name + '.png';
  const dir = "./public/templates/" + name;

  database.getEntry(db, name, 'templates').then((entry) => {
    if(entry) {
      console.log("[images] entry: " + entry);
      res.json({
        "code": 501,
        "message": "template with name \"" + name + "\" already exists! Please rename your template.",
      });
    } else {
      console.log("[images] no entry");
      
      fs.writeFile(dir, base64Data, 'base64', function(err) {
        if (err) {
          console.log('error in saving');
          return res.status(500).send(err);
        }

        var newTemplate = {
          "name": name,
        };

        console.log('posting template to db');
      
        database.postTemplateToDb(db, newTemplate).then(() => {
          console.log("[images] wrote new template to DB");
          res.json({
            "code": 201,
            "message": "Added template successfully!",
          });
        });
      });
    }
  });
})


/* GET templates from local file storage. */
router.get('/getTemplateNames', function(req, res, next) {
  const db = req.db;

  console.log('get template name from Db');

  const templates = db.get('templates');
  templates.find({}, 'name').then((temps) => {
    console.log(temps);
    res.json({
      "templates": temps
    })
  })
  console.log('sent templates');
});


/* POST a template file uploaded by the user. */
router.post('/uploadTemplate', function(req, res) {
  const db = req.db;
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log('err1');
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "userUploadFile") is used to retrieve the uploaded file
  let sampleFile = req.files.userUploadFile;
  let name = req.files.userUploadFile.name;
  console.log("[images] name = " + name);

  database.getEntry(db, name, 'templates').then((entry) => {
    if(entry) {
      console.log("[images] entry: " + entry);
      res.json({
        "code": 501,
        "message": "template with name \"" + name + "\" already exists! Please rename your file.",
      });
    } else {
      console.log("[images] no entry");
      // Use the mv() method to place the file somewhere on your server
      const newName = './public/templates/' + name;
      sampleFile.mv(newName, function(err) {
        if (err) {
          console.log('error in upload 500');
          return res.status(500).send(err);
        }
      
        var newTemplate = {
          "name": name,
        };
      
        database.postTemplateToDb(db, newTemplate).then(() => {
          console.log("[images] wrote new template to DB");
          res.json({
            "code": 201,
            "message": "Added template successfully!",
          });
        });
      })
    }
  });

});

module.exports = router;