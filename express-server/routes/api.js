var express = require('express');
var fs = require("fs"), json;
var router = express.Router();
var cors = require('cors');
var jimp = require('jimp');
var zipFolder = require('zip-folder');
var path = require('path');
const { text } = require('express');
var database = require('./database');

// helper function for printing one text to image
async function jimper(data, text, top, path, hasImage) {
    let image;
    if(hasImage) {
        // Read the image from buffer
        image = await jimp.read( Buffer.from(data, 'base64') );
    } else {
        image = await jimp.read('./public/templates/' + data + '.jpg');
    }

  // Load the font
  const font = await jimp.loadFont(jimp.FONT_SANS_64_BLACK);

  let w = image.bitmap.width; //  width of the image
  let h = image.bitmap.height; // height of the image

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

// helper function for printing multiple texts to image
async function jimperExtended(data, texts, path, hasImage) {
  // load or read image from buffer
  let image;
  if(hasImage) {
      image = await jimp.read( Buffer.from(data, 'base64') );
  } else {
      image = await jimp.read('./public/templates/' + data + '.jpg');
  }

  for (const text of texts) {
    // Load the font
    let font;

    // user chooses the font
    if(text.color === "black") {
      switch (text.size)
      {
        case 8:
          font = await jimp.loadFont(jimp.FONT_SANS_8_BLACK);
          break;
        case 16:
          font = await jimp.loadFont(jimp.FONT_SANS_16_BLACK);
          break;
        case 32: 
          font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
          break;
        case 64:
          font = await jimp.loadFont(jimp.FONT_SANS_64_BLACK);
          break;
        default: 
          font = await jimp.loadFont(jimp.FONT_SANS_16_BLACK);
      }
    } else {
      switch (text.size)
      {
        case 8:
          font = await jimp.loadFont(jimp.FONT_SANS_8_WHITE);
          break;
        case 16:
          font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
          break;
        case 32: 
          font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
          break;
        case 64:
          font = await jimp.loadFont(jimp.FONT_SANS_64_WHITE);
          break;
        default: 
          font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
      }
    }
    await image.print(font, text.posX, text.posY, text.text);
  }
 
  
	// Save the image
  try {
    if (fs.existsSync(path)) {
      console.log("file exists");
      return "fail";
    } else {
      await image.writeAsync(path);
      return "success";
    }
  } catch(err) {
    console.error(err)
  }
}

// helper function for printing multiple texts to image
async function jimperZip(data, texts, path, hasImage, pathZip) {
    // load or read image from buffer
    const top = texts.top;
    const bottom = texts.bottom;
    let image;
    if(hasImage) {
        image = await jimp.read( Buffer.from(data, 'base64') );
    } else {
        image = await jimp.read('./public/templates/' + data + '.jpg');
    }
    // Load the font
    const font = await jimp.loadFont(jimp.FONT_SANS_64_BLACK);

    let w = image.bitmap.width; //  width of the image
    let h = image.bitmap.height; // height of the image

    // Print top text to image
    await image.print(
    font,
    0,
    0,
    {
    text: texts.top,
    alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
    alignmentY: jimp.VERTICAL_ALIGN_TOP
    },
    w,
    h
    );

    // Print bottom text to image
    await image.print(
    font,
    0,
    0,
    {
    text: texts.bottom,
    alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
    alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
    },
    w,
    h
    );

    // Save the image
    try {
        if (fs.existsSync(path)) {
            console.log("file exists");
            return "fail";
        } else {
            await image.writeAsync(path);
            await image.writeAsync(pathZip);
            return "success";
        }
    } catch(err) {
        console.error(err)
    }
}

/*
* create a meme with top or bottom text
* @param {object} req - The properties of the meme, should have the form
* {
    "text": TEXT,
    "name": NAME,
    "place": PLACE,
    "image": ROOT_TO_FILE
  }
  responds with the url under which the meme can be downloaded or with an error message
*/
router.post('/createMeme', function(req, res) {
    const db = req.db;
    const text = req.body.text;
    const name = req.body.name;
    const place = req.body.place;
    const title = req.body.title;
    const path = './public/memes/' + name + '.png';

    let isTop;
    let data;
    let hasImage;
    let template;
    if(place==="top") {
        isTop = true;
    } else {
        isTop = false;
    }
    if(req.body.image) {
        hasImage = true;
        data = req.body.image.replace(/^data:image\/png;base64,/, "");
        template = 'custom image'
    } else {
        hasImage = false;
        data = req.body.template;
        template = data;
    }
    jimper(data, text, isTop, path, hasImage).then((result)=>{
        if(result === "success") {
            const newMeme = {
              "name": name + ".png",
              "title": title,
              "template": template,
              "date": new Date(),
              "upVotes": 0,
              "downVotes": 0,
              "upMinusDownVotes": [0]
            };

            // post image to meme db
            database.postNewMemeToDb(db, newMeme).then(() => {
              console.log("[api] wrote new meme to DB");
              res.json({
                "code": 201,
                "message": "saved image on server, get the meme under http://localhost:3005/memes/" + name + '.png',
              });
            });
        } else {
            res.json({
                "code": 501,
                "message": "A meme with this name already exists",
            });
        }
    })
})

/*
* create a meme with multiple texts at specified position and with custom style
* @param {object} req - The properties of the meme, should have the form
* {
    "name": NAME,
    "title": TITEL,
    "template": NAME_OF_TEMPLATE,
    "texts": [
        {
            "text": TEXT,
            "posX": POSITION_X,
            "posY": POSITION_Y,  
            "color": COLOR,
            "size": SIZE,
        },
        ...
    ]
  }
  responds with the url under which the meme can be downloaded or with an error message
*/
router.post('/createMemeMultipleTexts', function(req, res) {
  const db = req.db;
  const texts = req.body.texts;
  const name = req.body.name;
  const title = req.body.title;
  const path = './public/memes/' + name + '.png';

  console.log("[api] texts: " + texts);
  console.log("[api] name: " + name);
  console.log("[api] path: " + path);
  
  let data;
  let hasImage;
  let template;
  if(req.body.image) {
      hasImage = true;
      data = req.body.image.replace(/^data:image\/png;base64,/, "");
      template = 'costum image';
  } else {
      hasImage = false;
      data = req.body.template;
      template = data;
  }

  jimperExtended(data, texts, path, hasImage).then((result)=>{
      if(result === "success") {
        const newMeme = {
          "name": name + ".png",
          "title": title,
          "template": template,
          "date": new Date(),
          "upVotes": 0,
          "downVotes": 0,
          "upMinusDownVotes": [0]
        };

        // post image to meme db
        database.postNewMemeToDb(db, newMeme).then(() => {
          console.log("[api] wrote new meme to DB");
          res.json({
            "code": 201,
            "message": "saved image on server, get the meme under http://localhost:3005/memes/" + name + '.png',
          });
        });
      } else {
          res.json({
              "code": 501,
              "message": "A meme with this name already exists",
          });
      }
  })
})

/*
* create a set of memes from one image/template with top and bottom caption
* @param {object} req - The properties of the meme, should have the form
* {
    "texts": [
        {
            "title": TITLE,
            "name": NAME_OF_MEME,
            "top": TOP_CAPTION,
            "bottom": BOTTOM_CAPTION,
        },
        ...
    ],
    "name": "NAME_OF_ZIP",
    "template": "dog"
  }
  responds with the url under which the meme can be downloaded or with an error message
*/
router.post('/createZip', function(req, res) {
    const db = req.db;
    const memesList = req.body.texts;
    const name = req.body.name;
    if ('./public/zip/memesToZip'){
        fs.rmdirSync('./public/zip/memesToZip', { recursive: true });
    }
    // create temporary directory
    fs.mkdirSync("./public/zip/memesToZip");
    dirMemes =   './public/zip/memesToZip';
    dirZip = './public/zip/' + name + '.zip';

    let data;
    let hasImage;
    let template;
    if(req.body.image) {
        hasImage = true;
        data = req.body.image.replace(/^data:image\/png;base64,/, "");
        template = 'costum image';
    } else {
        hasImage = false;
        data = req.body.template;
        template = data;
    }

    // create memes with different texts
    memesList.map((texts) => {
        const nameMeme = texts.name;
        const path = './public/memes/' + nameMeme + '.png';
        const pathZip = './public/zip/memesToZip/' + nameMeme + '.png';
        jimperZip(data, texts, path, hasImage, pathZip).then((result)=>{
            if(result === "success") {
                const newMeme = {
                    "name": texts.name + ".png",
                    "title": texts.title,
                    "template": template,
                    "date": new Date(),
                    "upVotes": 0,
                    "downVotes": 0,
                    "upMinusDownVotes": [0]
                };

                // post image to meme db
                database.postNewMemeToDb(db, newMeme)
                /*.then(() => {
                    console.log("[api] wrote new meme to DB");
                    res.json({
                        "code": 201,
                        "message": "saved image on server, get the meme under http://localhost:3005/memes/" + name + '.png',
                    });
                });*/
            } else {
                res.json({
                    "code": 501,
                    "message": "A meme with this name already exists",
                });
            }
        })
    });

    // create zip of the set of memes with timeout
    setTimeout(function() {
        zipFolder(dirMemes, dirZip, function(err) {
            if(err) {
                console.log('zip could not be created', err);
                return res.status(500).send(err);
            }

            res.json({
            "code": 201,
            "message": "created zip file",
            });
            //delete temporary directory
            fs.rmdirSync(dirMemes, { recursive: true });
        })
    }, 3000);
})

module.exports = router;