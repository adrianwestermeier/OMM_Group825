var express = require('express');
var fs = require("fs"), json;
var router = express.Router();
var cors = require('cors');
var mongoClient = require('mongodb').MongoClient;
var jimp = require('jimp');

// helper function for printing one text to image
async function jimper(data, text, top, path, hasImage) {
    let image;
    if(hasImage) {
        // Read the image from buffer
        image = await jimp.read( Buffer.from(data, 'base64') );
    } else {
        image = await jimp.read('./public/images/' + data + '.jpg');
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
        // let imageBuffer = Buffer.from(data);
        // console.log(imageBuffer);
    } else {
        hasImage = false;
        data = req.body.template;
    }
    jimper(data, text, isTop, path, hasImage).then((result)=>{
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


// TODO: create texts from an array of texts 
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