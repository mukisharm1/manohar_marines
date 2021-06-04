const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const{landingPage,
   getRegister, 
   postRegister, 
   getLogin, 
   postLogin, 
   getLogout,
   getProfile,
   updateProfile
} = require('../controllers/index');
const {asyncErrorHandler, 
  isLoggedIn,
  isValidPassword,
	changePassword }= require('../middlewares/index');

/* GET home landingPage page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET /register */
router.get('/register', getRegister);
/* PUT /register */
router.post('/register', upload.single('image'), asyncErrorHandler(postRegister));
/* GET /login */
router.get('/login', getLogin);

/* POST /login */
router.post('/login', asyncErrorHandler(postLogin));

// logout route
router.get('/logout',getLogout);



/* Get/profile */
router.get('/profile', isLoggedIn,  asyncErrorHandler(getProfile));

/* PUT /profile */
router.put('/profile',
	isLoggedIn,
	upload.single('image'),
	asyncErrorHandler(isValidPassword),
	asyncErrorHandler(changePassword),
	asyncErrorHandler(updateProfile)
);


/* Get/forgot */
router.get('/forgot',(req, res, next)=> {
  res.send('GET/forgot');
});

/* Get/forgot */
router.put('/forgot',(req, res, next)=> {
  res.send('PUT/forgot');
});

/* Get/reset */
router.get('/reset/:token',(req, res, next)=> {
  res.send('Get/reset');
});

/* Get/reset */
router.put('/reset/:token',(req, res, next)=> {
  res.send('PUT/:token reset');
});
module.exports = router;
