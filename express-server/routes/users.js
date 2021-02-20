let express = require('express');
let router = express.Router();/* GET users listing. */
let database = require('./database');

router.post( "/postUser", function (req, res) {
  const db = req.db;
  console.log('got post request (generatedMeme) ', req.body);
  let user = {
    "username": req.body.username,
    "password": req.body.password,
  };

  database.postUserToDb(db, user).then(() => {
    res.json({
      "code": 201,
      "message": "saved meme successfully, refresh page to see changes.",
      "user": [user]
    });
  });
})

router.get('/getUsers', function(req, res, next) {
  const db = req.db;
  console.log('[users] getUsers');

  database.getUsersFromDb(db).then((users) => {
    console.log("[users] got users:" + users);
    res.json({
        "users": users
    });
    console.log('sent users');
  })
});

module.exports = router;
