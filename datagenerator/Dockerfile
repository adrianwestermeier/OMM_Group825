FROM mongo:latest
 COPY . .
 CMD mongoimport --collection templates --file templatedata.json --jsonArray --uri "mongodb://mongo:27017/omm-2021"