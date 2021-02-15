var express = require('express');
var fs = require("fs"), json;
var router = express.Router();
var cors = require('cors');
var mongoClient = require('mongodb').MongoClient;
var jimp = require('jimp');
var zipFolder = require('zip-folder');
var path = require('path');
const { text } = require('express');

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
  let h = image.bitmap.height;

  // image.print(font, 10, 10, 'Hello World!');

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

router.post('/createMeme', function(req, res) {
    const text = req.body.text;
    const name = req.body.name;
    const place = req.body.place;
    const path = './public/memes/' + name + '.png';
    let isTop;
    let data;
    let hasImage;
    if(place==="top") {
        isTop = true;
    } else {
        isTop = false;
    }
    if(req.body.image) {
        hasImage = true;
        data = req.body.image.replace(/^data:image\/png;base64,/, "");
    } else {
        hasImage = false;
        data = req.body.template;
    }
    jimper(data, text, isTop, path, hasImage).then((result)=>{
        if(result === "success") {
            res.json({
                "code": 201,
                "message": "saved image on server, get the meme under http://localhost:3005/memes/" + name + '.png',
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

  const texts = req.body.texts;
  const name = req.body.name;
  const title = req.body.title;
  const path = './public/memes/' + name + '.png';

  console.log("[api] texts: " + texts);
  console.log("[api] name: " + name);
  console.log("[api] path: " + path);
  
  let data;
  let hasImage;
  
  if(req.body.image) {
      hasImage = true;
      data = req.body.image.replace(/^data:image\/png;base64,/, "");
  } else {
      hasImage = false;
      data = req.body.template;
  }

  jimperExtended(data, texts, path, hasImage).then((result)=>{
      if(result === "success") {
          res.json({
              "code": 201,
              "message": "saved image on server, get the meme under http://localhost:3005/memes/" + name + '.png',
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
* the code below will create a meme and add it to a set of memes
* @param {object} req - The properties of the meme set
* @param {object} textList - The different texts
* @param {const} name - The name of the meme
* @param {string} place - The place of the text on the image
*/
router.post('/createZip', function(req, res) {
  const textList = req.body.text;
  const name = req.body.name;
  const place = req.body.place;
  // create temporary directory
  fs.mkdirSync("./public/zip/memesToZip");
  dirMemes =   './public/zip/memesToZip';
  dirZip = './public/zip/' + name + '.zip';

  let isTop;
  let data;
  let hasImage;
  if(place==="top") {
      isTop = true;
  } else {
      isTop = false;
  }
  if(req.body.image) {
      hasImage = true;
      data = req.body.image.replace(/^data:image\/png;base64,/, "");

  } else {
      hasImage = false;
      data = req.body.template;
  }

  // variable to set different names to the created memes
  var i = 0;
  // create memes with different texts
  textList.map((text) => {
      jimper(data, text, isTop, './public/zip/memesToZip/' + name + '(' + i + ').png', hasImage),
      i = i+1
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