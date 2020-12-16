# OMM_Group825
## create mongo database with name "meme-generator-db"
in command line (switches to mongo shell
```
mongo
```
in mongo shell
```
use meme-generator-db
```

## import data from json
in command line
```
mongoimport --jsonArray --db meme-generator-db --collection images --file imagesDatabase.json
```
