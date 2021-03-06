var express = require('express');
var fs = require("fs"), json;
var router = express.Router();
var path = require('path');
var webshot = require('webshot-node');
var database = require('./database');

/**
 * this is taken mainly from https://github.com/mimuc/omm-ws2021/tree/master/06-christmas/ScreenshotApp
 * POST to this url ('/screenshots/create') generates a screenshot file and responds with its relative path.
 * example response
 * {
 *    "status": "ok"
 *    "message": "created new screenshot",
 *    "path": "/shoot/screenshots/wwwnpmjscompackagewebshot.png",
 *    "responseTime": 5633
 * }
 * if there was an error, the response also contains a "reason" property.
 */
router.post('/create', function(req, res) {
    const db = req.db;
    // define directory to save new template
    const screenshotsDirectory = './public/templates/';

    // make sure that the directory exists.
    if (!fs.existsSync(screenshotsDirectory)) {
      fs.mkdirSync(screenshotsDirectory);
    }
    
    // performance metrics.
    var startTime = Date.now(), elapsedMilliseconds;
    var targetURL = req.body.url || '';
    console.log('[screenshot] target url: ' + targetURL);
    // the regex strips the "https", dots and slashes from the targetURL
    var fileName = targetURL.replace(/(^http[s]?:\/\/)|[.\/\\]/ig, '') + '.png';
    // screenshot output path = full file path.
    var output = path.join(screenshotsDirectory, fileName); 
    // tell the client where the file lies.
    var responsePath = req.baseUrl + '/public/templates/' + fileName;   
    var responseJSON = {
      status: 'ok'
    };  
    if (targetURL != '') { // parameter set correctly.
      // check if the file is already available:
      fs.stat(output, function(e, stat) {   
        if (!e && stat.isFile()) {
          elapsedMilliseconds = Date.now() - startTime;
          responseJSON.message = 're-used screenshot';
          responseJSON.path = responsePath;
          responseJSON.responseTime = elapsedMilliseconds;
          res.json(responseJSON);
        } else {
          // the file is not available, yet.
          // so we have to make the expensive call to webshot()
          const options = {
              renderDelay: 3000,
          }
          webshot(targetURL, output, options,function(err) {
              elapsedMilliseconds = Date.now() - startTime;
              responseJSON.responseTime = elapsedMilliseconds;
            if (!err) {
              // all good.
              // the path can be used on the client to fetch the image.
              responseJSON.path = responsePath;
              responseJSON.message = 'created new screenshot';
              var newTemplate = {
                  "name": fileName,
                };
            
                database.postTemplateToDb(db, newTemplate).then(() => {
                  console.log("[screenshot] wrote new template to DB");
                  // send the response here.
                  res.json(responseJSON);
                });
            } else {
              // politely handle errors.
              responseJSON.status = 'error';
              responseJSON.message = 'could not create screenshot';
              responseJSON.reason = err.toString();
            
              // send the response here.
              res.json(responseJSON);
            }
          });
        }
      });
    } else {
      // the request was made without the "url" query parameter.
      res.json({
        status: 'error',
        message: 'missing parameter',
        reason: 'Parameter "url" missing.',
        responseTime: Date.now() - startTime
      })
    }
});

module.exports = router;