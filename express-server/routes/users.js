let express = require('express');
const mongoClient = require("mongodb");
let router = express.Router();/* GET users listing. */

let url = "mongodb://localhost:27017/";

let users;

function postUserToDb(user) {

  mongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("meme-generator-db");
    dbo.collection("users").insertOne(user, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });

}

function getUsersFromDb(){
  mongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("meme-generator-db");
    dbo.collection("users").find().toArray(function(err, result) {
      if (err) throw err;
      users = result;
      db.close();
    });
  });
  console.log('users ' + users);
}

router.post( "/postUser", function (req, res) {
  console.log('got post request (generatedMeme) ', req.body);
  let user = {
    "username": req.body.username,
    "password": req.body.password,


  };

  postUserToDb(user);
  res.json({
    "code": 201,
    "message": "saved meme successfully, refresh page to see changes.",
    "user": [user]
  });
  getUsersFromDb();
})

getUsersFromDb()

router.get('/getUsers', function(req, res, next) {
  console.log('[users] getUsers');

  let users = [];
  console.log('get meme name from Db');
  mongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("meme-generator-db");
    dbo.collection("users").find().toArray(function(err, result) {
      if (err) throw err;

      result.forEach(el => {
        users.push(el);
      })
      console.log('data to send from db: ' + users);
      res.json({
        "users": users
      });
      db.close();
    });
  });
  console.log('sent users');
});

module.exports = router;
