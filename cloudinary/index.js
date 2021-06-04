const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name:'bandhanihouse',
    api_key:'773153889848631',
    api_secret:process.env.CLOUDINARY_SECRET
});



const { CloudinaryStorage } = require('multer-storage-cloudinary');
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
	let buf = crypto.randomBytes(16);
	buf = buf.toString('hex');
	let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
	uniqFileName += buf;
	console.log(uniqFileName)
    return {
      folder: 'manohar_marine',
      format: 'jpeg',
      public_id: uniqFileName,
    };
  },
});

module.exports = {
	cloudinary,
	storage
}