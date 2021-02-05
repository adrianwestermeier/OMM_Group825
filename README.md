# OMM_Group825

## setup mongo DB
make sure mongo instance is running on your machine (start under linux: sudo systemctl start mongod)
### create mongo database with name "meme-generator-db"
in command line (switches to mongo shell)
```
mongo
```
in mongo shell
```
use meme-generator-db
```

### import data from json
in command line
```
mongoimport --jsonArray --db meme-generator-db --collection images --file imagesDatabase.json
```
### see if data was imported
```
mongo
```
```
use meme-generator-db
```
```
db.images.find()
```


## launch express server
npm install (including express-fileupload)
in command line: npm start
open http://localhost:3005  (look up/change port in express-server/bin/www if necessary)

## Server API
### Get any existing meme
You can get any existing meme under http://localhost:3005/images/NAME_OF_MEME.png

### Create a meme
Important: Images have to be base64 encoded.

To create a meme with your custom image (which you have saved under ROOT_TO_FILE/YOUR_FILE_NAME - has to be .png) and a custom top/bottom text YOUR_TEXT, use the json
```
{
    "text": YOUR_TEXT,
    "name": NAME,
    "place": PLACE,
    "image": ROOT_TO_FILE/YOUR_FILE
}
```
where NAME is the name under which you want to save the meme (must not exist yet!) and PLACE is either "top" or "bottom".
Send this json to http://localhost:3005/api/createMeme

TODO: multiple texts with format + describe just by json

#### alternatively
Instead of using your own image you can use the name of an extisting meme template (currently one of ['horse','dog','guy'])
In this case your json should look like this
```
{
    "text": YOUR_TEXT,
    "name": NAME,
    "place": PLACE,
    "template": NAME_OF_TEMPLATE
}
```

#### Example creation with command line using an image
For top text:
```
(echo -n '{"text": "YOUR_TEXT", "name": "NAME", "place": "top", "image": "'; base64 ROOT_TO_FILE/YOUR_FILE_NAME; echo '"}') |
curl -H "Content-Type: application/json" -d @-  http://localhost:3005/api/createMeme
```
or for bottom text:
```
(echo -n '{"text": "YOUR_TEXT", "name": "NAME", "place": "bottom", "image": "'; base64 ROOT_TO_FILE/YOUR_FILE_NAME; echo '"}') |
curl -H "Content-Type: application/json" -d @-  http://localhost:3005/api/createMeme
```

#### Example creation with command line using an meme template name
For top text:
```
curl -H "Content-Type: application/json" -d '{"text": "YOUR_TEXT", "name": "NAME", "place": "top", "template": "dog"}'  http://localhost:3005/api/createMeme
```
or for bottom text:
```
curl -H "Content-Type: application/json" -d '{"text": "YOUR_TEXT", "name": "NAME", "place": "bottom", "template": "guy"}'  http://localhost:3005/api/createMeme
```

## launch react client app
npm install (including axios)
in command line: npm start
open http://localhost:3000