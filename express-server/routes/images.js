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

/**
 * helper for downloading by url
 */
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

/**
 * download an image from an existing image url and save it to the db as well as to static template folder
 */
router.post('/createByUrl', function(req, res, next) {
  console.log('[images] create by url ', req.body);
  const db = req.db;
  
  const name = req.body.name;
  // e.g. https://i.imgflip.com/24y43o.jpg
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

  // see if template with this name already exists in the db
  database.getEntry(db, name, 'templates').then((entry) => {
    if(entry) {
      console.log("[images] entry: " + entry);
      res.json({
        "code": 501,
        "message": "template with name \"" + name + "\" already exists! Please rename your file.",
      });
    } else {
      console.log("[images] no entry yet");

      // download the image and post it to the db
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


/**
 * get base64 encoded image, save it to db as well as to static memes folder
 */
router.post('/saveCreatedMeme', function(req, res) {
  const db = req.db;
  const base64Data = req.body.img.replace(/^data:image\/png;base64,/, "");
  const name = req.body.name + '.png';
  const title = req.body.title;
  const user = req.body.user;
  const isPrivate = req.body.isPrivate;
  const dir = "./public/memes/" + name;
  const template = req.body.template;

  // check if meme with this name already exists
  database.getEntry(db, name, 'generatedMemes').then((entry) => {
    if(entry) {
      console.log("[images] entry: " + entry);
      res.json({
        "code": 501,
        "message": "meme with name \"" + name + "\" already exists! Please rename your meme.",
      });
    } else {
      console.log("[images] no entry yet");
      
      // write file to folder
      fs.writeFile(dir, base64Data, 'base64', function(err) {
        if (err) {
          console.log('error in saving');
          return res.status(500).send(err);
        }

        const newMeme = {
          "name": name,
          "title": title,
          "user": user,
          "isPrivate": isPrivate,
          "template": template,
          "date": new Date(),
          "upVotes": 0,
          "downVotes": 0,
          "upMinusDownVotes": [0]
        };

        console.log(newMeme);
      
        // post image to meme db
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

/**
 * get a base64 encoded user camera image, save it to the db as well as to static template file folder
 */
router.post('/saveTemplateSnapshot', function(req, res) {
  const db = req.db;
  const base64Data = req.body.img.replace(/^data:image\/png;base64,/, "");
  const name = req.body.name + '.png';
  const dir = "./public/templates/" + name;

  // check if template with this name already exists
  database.getEntry(db, name, 'templates').then((entry) => {
    if(entry) {
      console.log("[images] entry: " + entry);
      res.json({
        "code": 501,
        "message": "template with name \"" + name + "\" already exists! Please rename your template.",
      });
    } else {
      console.log("[images] no entry yet");
      
      // save file to folder
      fs.writeFile(dir, base64Data, 'base64', function(err) {
        if (err) {
          console.log('error in saving');
          return res.status(500).send(err);
        }

        var newTemplate = {
          "name": name,
        };
      
        // save template to db
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

/**
 * get template names of all existing templates in the db
 */
router.get('/getTemplateNames', function(req, res, next) {
  const db = req.db;

  const templates = db.get('templates');
  templates.find({}, 'name').then((temps) => {
    console.log(temps);
    res.json({
      "templates": temps
    })
  })
});


/**
 * save template file uploaded by the user to local file folder and post it to db 
 */
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

  // check if template with this name already exists
  database.getEntry(db, name, 'templates').then((entry) => {
    if(entry) {
      console.log("[images] entry: " + entry);
      res.json({
        "code": 501,
        "message": "template with name \"" + name + "\" already exists! Please rename your file.",
      });
    } else {
      console.log("[images] no entry");
      // Use the mv() method to place the file on the server
      const newName = './public/templates/' + name;
      sampleFile.mv(newName, function(err) {
        if (err) {
          console.log('error in upload 500');
          return res.status(500).send(err);
        }
      
        var newTemplate = {
          "name": name,
        };
      
        // post the tempalte to the db
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