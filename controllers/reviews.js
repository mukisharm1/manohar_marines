const Post = require('../models/post');
const Review = require('../models/review');

module.exports={
    
   // Posts Create
   async reviewCreate(req, res, next) {
    //    find by the post by id
    let post = await Post.findById(req.params.id).populate('reviews').exec();
    let haveReviewed = post.reviews.filter(review =>{
        return review.author.equals(req.user._id);
    }).length
    if(haveReviewed){
        req.session.error ='Sorry you can create on review for per post';
        return res.redirect(`/posts/${post.id}`);
    }
    // create the review
    req.body.review.author = req.user._id;
    console.log(req.body.review.author);
    let review = await Review.create(req.body.review);
    console.log(review.author);
    // assign review to post
    post.reviews.push(review);
    // save the post
    post.save();
    // redirect to the post
    req.session.success = 'Review created successfully!';
    res.redirect(`/posts/${post.id}`);
},
   
        //     // Reviews Update
        async reviewUpdate(req,res,next){
        await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
        req.session.success = "Review updated successfully!";
        res.redirect(`/posts/${req.params.id}`);
        
        },
    
		
        
       // Reviews Destroy
	async reviewDestroy(req, res, next) {
		await Post.findByIdAndUpdate(req.params.id, {
			$pull : { reviews : req.params.review_id }
		});
		
        await Review.findByIdAndRemove(req.params.review_id);
		req.session.success = 'Review deleted successfully!';
		res.redirect(`/posts/${req.params.id}`);
	}
}
