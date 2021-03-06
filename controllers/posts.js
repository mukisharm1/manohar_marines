const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken= process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');




module.exports={
    async postIndex(req,res,next){
        let posts = await Post.paginate({},{
            page: req.query.page|| 1,
            limit : 10,
            sort:'-_id'
        });
        posts.page= Number(posts.page);
        res.render('posts/index',{posts,
            mapBoxToken,
            title:'postIndex'
        });
    },
    // post new
    postNew(req,res,next){
        res.render('posts/new');
    },
   // Posts Create
   async postCreate(req, res, next) {
    // to get the images plug in array
    req.body.post.images = [];
    
    for(const file of req.files) {
       
        req.body.post.images.push({
            path: file.path,
            filename: file.filename
        });
    }
    let response = await geocodingClient
		  .forwardGeocode({
		    query: req.body.post.location,
		    limit: 1
		  })
          .send()
          req.body.post.geometry= response.body.features[0].geometry;
          req.body.post.author = req.user._id;
         
          let post = new Post(req.body.post);
          post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
          await post.save();
    req.session.success ="Post created successfully!";
    res.redirect(`/posts/${post.id}`);
     }, 
    //  Posts show 
    async postShow(req,res,next){
        let post = await Post.findById(req.params.id).populate({
            path: 'reviews',
           options:{sort: {'_id':-1},
            populate :{
                path: 'author',
                model: 'User'
           
         }}
    });
    const floorRating= post.calculateAvgRating();
  
        res.render('posts/show',{post,mapBoxToken,floorRating});
    },
    // edit the post
         postEdit(req, res, next) {
            res.render('posts/edit');
        },
        // update the post
        async postUpdate(req,res,next){
            	// pull post from res.locals
	const { post } = res.locals;
		// check if there's any images for deletion
		if(req.body.deleteImages && req.body.deleteImages.length) {			
			// assign deleteImages from req.body to its own variable
			let deleteImages = req.body.deleteImages;
			// loop over deleteImages
			for(const filename of deleteImages) {
				// delete images from cloudinary
				await cloudinary.uploader.destroy(filename);
				// delete image from post.images
				for(const image of post.images) {
					if(image.filename === filename) {
						let index = post.images.indexOf(image);
						post.images.splice(index, 1);
					}
				}
			}
		}
		// check if there are any new images for upload
		if(req.files) {
			// upload images
			for(const file of req.files) {
				
				// add images to post.images array
				post.images.push({
					path: file.path,
					filename: file.filename
				});
			}
		} 

        // check for nay upadate  in location
        if(req.body.post.location !== post.location){
            let response = await geocodingClient
		  .forwardGeocode({
		    query: req.body.post.location,
		    limit: 1
		  })
          .send();
          post.geometry = response.body.features[0].geometry;
          post.location = req.body.post.location;
        }
       
		// update the post with any new properties
		post.title = req.body.post.title;
		post.description = req.body.post.description;
		post.price = req.body.post.price;
        post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
		
		// save the updated post into the db
		await post.save();
       		// redirect to show page
		res.redirect(`/posts/${post.id}`);
        },
        // delete the post
        async postDestroy(req,res,next){
         // pull post from res.locals
	const { post } = res.locals;
            for(const image of post.images){
             await cloudinary.uploader.destroy(image.filename);
            }
            await post.remove();
            req.session.success = 'post successfully deleted';
            res.redirect('/posts');
        }
}