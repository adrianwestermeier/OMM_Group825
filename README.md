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
### Create a meme
Important: Images have to be base64 encoded.

To create a meme with your custom image saved under ROOT_TO_FILE/YOUR_FILE_NAME (has to be .png) and a custom top/bottom text YOUR_TEXT, use the json
```
{
    "text": YOUR_TEXT,
    "name": NAME,
    "image": ROOT_TO_FILE/YOUR_FILE
}
```
where NAME is the name under which you want to save the meme (must not exist yet!),
and send to http://localhost:3005/images/createMemeTop for top text or http://localhost:3005/images/createMemeBottom for bottom text respectivley.

TODO: multiple texts with format + describe just by json

#### Example creation with command line
For top text:
```
(echo -n '{"text":"YOUR_TEXT", "name": "NAME", "image": "'; base64 ROOT_TO_FILE/YOUR_FILE_NAME; echo '"}') |
curl -H "Content-Type: application/json" -d @-  http://localhost:3005/images/createMemeTop
```
or for bottom text:
```
(echo -n '{"text":"YOUR_TEXT", "name": "NAME", "image": "'; base64 ROOT_TO_FILE/YOUR_FILE_NAME; echo '"}') |
curl -H "Content-Type: application/json" -d @-  http://localhost:3005/images/createMemeBottom
```

### Get any existing meme
TODO

## launch react client app
npm install (including axios)
in command line: npm start
open http://localhost:3000