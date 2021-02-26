FROM mongo:latest
 COPY . .
 CMD mongoimport --db meme-generator-db --collection templates --file templatedata.json --jsonArray --uri "mongodb://mongo:27017/"