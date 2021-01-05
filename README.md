# OMM_Group825

## setup mongo DB
make sure mongo instance is running on your machine (start under linux: sudo systemctl start mongod)
### create mongo database with name "meme-generator-db"
in command line (switches to mongo shell
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

## launch react client app
npm install (including axios)
in command line: npm start
open http://localhost:3000