// require cloudinary 
const cloudinary = require('cloudinary').v2;

// require CloudinaryStorage
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// configure cloudinary
cloudinary.config({ 
    // cloudinary account
    cloud_name: process.env.CLOUD_NAME, // cloud name
    api_key: process.env.CLOUD_API_KEY, // api key
    api_secret: process.env.CLOUD_API_SECRET // api secret
});


// define CloudinaryStorage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'HODOPHILES_DEV', // folder name
        allowedFormats: ['jpeg', 'png', 'jpg'] // allowed formats
    }
});


// export cloudinary and storage
module.exports = { cloudinary, storage };