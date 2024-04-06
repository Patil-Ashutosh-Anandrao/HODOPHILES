// require express
const express = require('express');  

// create a new Router
const router = express.Router();


//require the wrapAsync module
const wrapAsync = require('../public/util/wrapAsync.js');

// require the ExpressError module
const ExpressError = require('../public/util/ExpressError.js');


// require listingSchema
const { listingSchema, reviewSchema } = require('../schema.js');


// require the listing model
const Listing = require('../models/listing.js');

// require the middleware module
const {  isLoggedIn, isOwner , validateListing} = require('../middleware.js');

// require the listing from controller folder
const listingsController = require('../controllers/listings.js');

// require multer 
const multer  = require('multer');

// require storage
const { storage } = require('../cloudConfig.js');

// require upload for multer 
const upload = multer({ storage });



// code of router.route 
router
.route("/")
.get(wrapAsync (listingsController.index))

 .post( // validateListing
 isLoggedIn,
 upload.single('listing[image]'),
 wrapAsync (listingsController.createListing)
 );


// .post ( (req, res) => {
//         res.send(req.file);
// });

// New Route 
router.get('/new', isLoggedIn, listingsController.renderNewForm   );


// code of router.route 
router
.route("/:id")
.get(wrapAsync (listingsController.showListing))
.put( isLoggedIn,
        isOwner,
        validateListing,
        wrapAsync (listingsController.updateListing)
)
.delete(    isLoggedIn,
            isOwner,
            wrapAsync (listingsController.destroyListing)
);


// Edit Route
router.get('/:id/edit', 
        isLoggedIn,
        isOwner,
        wrapAsync (listingsController.renderEditForm)
);


// // Create Index Route (fetch datafrom Db and show on webpage)
// router.get('/',wrapAsync (listingsController.index));

// show Route 
// router.get('/:id', wrapAsync (listingsController.showListing));


// // Create Route type - 2 of validating  schema 
// router.post('/', // validateListing,
//     isLoggedIn,wrapAsync (listingsController.createListing)
// );


// // update Route
// router.put('/:id', 
//         isLoggedIn,
//         isOwner,
//         validateListing,
//         wrapAsync (listingsController.updateListing)
// );


// // Delete Route 
// router.delete('/:id', 
//             isLoggedIn,
//             isOwner,
//             wrapAsync (listingsController.destroyListing)
// );


module.exports = router; // export router