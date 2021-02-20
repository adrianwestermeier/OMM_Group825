let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let logger = require('morgan');
let cors = require('cors');
const fileUpload = require('express-fileupload');

// if the environment parameter MONGO_URI is set use that (for Docker), otherwise localhost
const MONGO_URI = process.env.MONGO_URI || "localhost:27017";
console.log('MONGO_URI: '+ MONGO_URI)
// connect to database
const db = require('monk')(MONGO_URI+'/meme-generator-db'); 

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let apiRouter = require('./routes/api');
let imagesRouter = require('./routes/images');
let generatedMemesRouter = require('./routes/generatedMemes');
let screenshotRouter = require('./routes/screenshot');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(fileUpload());
app.use(logger('dev'));
// set high limits to be able to send images
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use(cookieParser());
// allow cors for all clients
app.use(cors())
app.options('*', cors())
app.use(express.static(path.join(__dirname, 'public')));

// set the db for global access in the routes
app.use(function(req,res,next){  
  req.db = db;
  next();
});

// define routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/images', imagesRouter);
app.use('/generatedMemes', generatedMemesRouter);
app.use('/screenshot', screenshotRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
