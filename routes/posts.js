const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const {asyncErrorHandler,isLoggedIn, isAuthor}= require('../middlewares/index');
const{postIndex,
  postNew,
  postCreate,
  postShow,
  postEdit,
  postUpdate,
  postDestroy
  
}= require('../controllers/posts');


/* Get posts index/posts */
router.get('/', asyncErrorHandler(postIndex));


  /* Get posts NEW /posts/new */
router.get('/new',isLoggedIn, postNew);
  

  /* Post posts CREATE /posts/:id */
  router.post('/',isLoggedIn, upload.array('images', 4) , asyncErrorHandler(postCreate));


  /* Get posts SHOW /posts/:id */
router.get('/:id',asyncErrorHandler(postShow));

  /* Get posts EDIT /posts/:id/edit */
router.get('/:id/edit', isLoggedIn, asyncErrorHandler(isAuthor),postEdit);

  /* PUT posts UPDATE /posts/:id */
router.put('/:id',isLoggedIn, asyncErrorHandler(isAuthor), upload.array('images', 4), asyncErrorHandler(postUpdate));


  /* Get posts DESTROYS /posts/:id */
router.delete('/:id',isLoggedIn, asyncErrorHandler(isAuthor), asyncErrorHandler(postDestroy));

module.exports = router;