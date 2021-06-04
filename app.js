require('dotenv').config()

const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const User = require('./models/user');
const session = require('express-session');
const mongoose= require('mongoose');
const methodOverride = require('method-override');
  // const seedPosts = require('./seeds');
  // seedPosts();

// required routes
const index = require('./routes/index');
const posts = require('./routes/posts');
const reviews = require('./routes/reviews');


const app = express();
mongoose.connect('mongodb://localhost:27017/manohar_marine', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('we\'re connected!');
});

// for ejs template pnly
app.engine('ejs',engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'))

// app.use(favicon(path.join(__dirname,'public','favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// config passport and sessions
app.use(session({
  secret: 'manohar_marine',
  resave: false,
  saveUninitialized: true,
  }));
  app.use(passport.initialize());
  app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// title middleware
app.use(function(req,res,next){

  // req.user = {
  //   '_id' : '60956c76d8e1f53f7cf90489',
  //   'username' : 'muki'};
  //   res.locals.User = req.user;
  
    // req.user = {
    //   // '_id' : '609ab0c70f10ab25141f1de6',
    //   '_id' : '60972f78e9aeff2bd80c3a2f',
    //   'username' : 'mukesh sharma'
    // }
    res.locals.currentUser = req.user;
  // create local title 
  res.locals.title = 'manohar-marine';
  // set success flash message
  res.locals.success = req.session.success || '';
  delete req.session.success;
// set error flash message
res.locals.error = req.session.error || '';
delete req.session.error;
  //  proceed to next function  in the middleware
next();
});

// routes config
app.use('/', index);
app.use('/posts',posts);
app.use('/posts/:id/reviews', reviews);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  console.log(err);
  req.session.error = err.message;
  res.redirect('back');
});

module.exports = app;
