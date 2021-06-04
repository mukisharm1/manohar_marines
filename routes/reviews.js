const express = require('express');
const router = express.Router({mergeParams:true});
const {asyncErrorHandler,isReviewAuthor}= require('../middlewares/index');
const{  
  reviewCreate,
  reviewUpdate,
  reviewDestroy
  
}= require('../controllers/reviews');


  /* Post reviews CREATE posts/reviews/:id */
router.post('/', asyncErrorHandler(reviewCreate));


  

  /* PUT reviews UPDATE /reviews/:id */
router.put('/:review_id', isReviewAuthor,asyncErrorHandler(reviewUpdate));


  /* Get reviews DESTROYS /reviews/:id */
router.delete('/:reviews_id', isReviewAuthor,asyncErrorHandler(reviewDestroy));

module.exports = router;