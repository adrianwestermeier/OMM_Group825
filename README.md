# OMM_Group825

# Use docker compose
In the main folder build the docker composer: 
```
sudo docker-compose build
```
and start it:
```
sudo docker-compose up
```

OR

# Setup locally

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
mongoimport --jsonArray --db meme-generator-db --collection templates --file templates.json
```
### see if data was imported
```
mongo
```
```
use meme-generator-db
```
```
db.templates.find()
```


## launch express server
go to /express-server and run
```
npm install
```
then run
```
npm start
```

## launch react client app
go to /react-client and run
```
npm install
```
then run
```
npm start
```
open http://localhost:3000 to see the app


# Server API
### Get any existing meme
You can get any existing meme under http://localhost:3005/memes/NAME_OF_MEME.png

### Create a meme
Important: Images have to be base64 encoded.

To create a meme with your custom image (which you have saved under ROOT_TO_FILE/YOUR_FILE_NAME - has to be .png) and a custom top/bottom text YOUR_TEXT, use the json
```
{
    "user": USER,
    "text": YOUR_TEXT,
    "name": NAME,
    "title": TITLE,
    "place": PLACE,
    "image": ROOT_TO_FILE/YOUR_FILE
}
```
where the USER is your existing username, NAME is the name under which you want to save the meme (must not exist yet!), TITLE is some title for it and PLACE is either "top" or "bottom".
Send this json to http://localhost:3005/api/createMeme

#### alternatively
Instead of using your own image you can use the name of an extisting meme template (currently one of ['horse','dog','guy'])
In this case your json should look like this
```
{
    "user": USER,
    "text": YOUR_TEXT,
    "name": NAME,
    "title": TITLE,
    "place": PLACE,
    "template": NAME_OF_TEMPLATE
}
```

#### Example creation with command line using an image
For top text:
```
(echo -n '{"user": "username", "text": "YOUR_TEXT", "name": "NAME", "title": "funny", "place": "top", "image": "'; base64 ROOT_TO_FILE/YOUR_FILE_NAME; echo '"}') |
curl -H "Content-Type: application/json" -d @-  http://localhost:3005/api/createMeme
```
or for bottom text:
```
(echo -n '{"user": "username", "text": "YOUR_TEXT", "name": "NAME", "title": "funny", "place": "bottom", "image": "'; base64 ROOT_TO_FILE/YOUR_FILE_NAME; echo '"}') |
curl -H "Content-Type: application/json" -d @-  http://localhost:3005/api/createMeme
```

#### Example creation with command line using an meme template name
For top text:
```
curl -H "Content-Type: application/json" -d '{"user": "username", "text": "YOUR_TEXT", "name": "NAME", "title": "funny", "place": "top", "template": "dog"}'  http://localhost:3005/api/createMeme
```
or for bottom text:
```
curl -H "Content-Type: application/json" -d '{"text": "YOUR_TEXT", "name": "NAME", "title": "funny", "place": "bottom", "template": "guy"}'  http://localhost:3005/api/createMeme
```

### Create a meme with multiple texts
You can also create a meme with multiple texts and styles based on a template. As above you can use a json like this
```
{
    "user": USER,
    "name": NAME,
    "title": TITEL,
    "template": NAME_OF_TEMPLATE,
    "texts": [
        {
            "text": YOUR_TEXT,    
            "posX": POSITION_X,
            "posY": POSITION_Y,  
            "color": COLOR,
            "size": SIZE,
        },
        ...
    ]
}
```
to create a meme. YOUR_TEXT is the text you want to write, POSITION_X is the horizontal position and POSITION_Y the vertical position of the text respectively. COLOR is the color of the text (black or white), SIZE is the size of the text (one of 8, 16, 32, 64, 128).
Send this json to http://localhost:3005/api/createMemeMultipleTexts

#### Example creation of meme with multiple texts
For top text:
```
curl    
    -H "Content-Type: application/json" 
    -d '{
            "user": "username", "name": "cool_name", "title":"some_title", "template": "horse", 
            "texts": [
                    {"text":"first_text", "posX":100, "posY":100, "color":"black", "size":32},
                    {"text": "second_text", "posX":600, "posY":1600, "color": "white", "size":64}
                ]}'  
http://localhost:3005/api/createMemeMultipleTexts
```

### Create a set of memes
You can also create a set of memes with a top and bottom text based on a template or on a own image provided as a zip file. As above you can use a json like this
```
{
    "user": "username",
    "texts": [
        {
            "title": TITLE,    
            "name": NAME_OF_MEME,
            "top": TOP_TEXT,  
            "bottom": BOTTOM_TEXT,
        },
        ...
    ],
    "name": NAME_OF_ZIP,
    "template": NAME_OF_TEMPLATE,
OR: "image": ROOT_TO_FILE/YOUR_FILE
}
```
to create a set of memes. TITLE is the title of the meme, NAME_OF_MEME is the name of the meme and have to be unique, TOP_TEXT and BOTTOM_TEXT are the texts you want to write. NAME_OF_ZIP is the name under which you want to save the zip file and have to be unique.
Send this json to http://localhost:3005/api/createZip

Note: "top" and "bottom" have to be passed. If no text is to be assigned, then leave it empty. Example with no top text: {"title":"TITLE", "name":"NAME_OF_MEME", "top":"", "bottom":"TEXT"}

#### Example create a set of memes
Example with template:
```
curl 
    -H "Content-Type: application/json" 
    -d '{
        "user": "username",
        "texts": [
            {"title":"FIRST_TITLE", "name":"NAME_OF_FIRST_MEME", "top":"FIRST_TOP_TEXT", "bottom":"FIRST_BOTTOM_TEXT"},
            {"title":"SECOND_TITLE", "name":"NAME_OF_SECOND_MEME", "top":"SECOND_TOP_TEXT", "bottom":"SECOND_BOTTOM_TEXT"},
            {"title":"THIRD_TITLE", "name":"NAME_OF_THIRD_MEME", "top":"THIRD_TOP_TEXT", "bottom":"THIRD_BOTTOM_TEXT"}
            ], 
        "name": "NAME_OF_ZIP", "template": "dog"}'  
http://localhost:3005/api/createZip
```
You can get any existing zip file under http://localhost:3005/zip/NAME_OF_ZIP.zip

Also you can get any meme you have added to the set under http://localhost:3005/memes/NAME_OF_MEME.png

### Get a set of memes
You can also get a set of memes by searching after a title or a part of a title. All generated Memes with that title are given as a zip file. The specified Maximum amount of retrieved images is 10. As above you can use a json like this
```
{
    "search": (PART_OF_)TITLE,
    "name": NAME_OF_ZIP,
}
```
to get a set of memes. (PART_OF_)TITLE is the title or just the part of the title you want to search for and NAME_OF_ZIP is the name under which you want to save the zip file.
Send this json to http://localhost:3005/api/getZip

#### Example get a set of memes
Example to get a set of memes
```
curl -H "Content-Type: application/json" -d '{"search": "funny", "name": "NAME_OF_ZIP"}' http://localhost:3005/api/getZip
```
As above you can get any existing zip file under http://localhost:3005/zip/NAME_OF_ZIP.zip
