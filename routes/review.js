// require express
const express = require('express');  

// create a new Router
const router = express.Router({mergeParams:true});


//require the wrapAsync module
const wrapAsync = require('../public/util/wrapAsync.js');

// require the ExpressError module
const ExpressError = require('../public/util/ExpressError.js');


// require listingSchema
const { listingSchema, reviewSchema } = require('../schema.js');

// require reviews 
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');


// require the listing model
const Listing = require('../models/listing.js');

// require the Review model
const Review = require('../models/review.js');

// require review from controller 
const  reviewController = require('../controllers/reviews.js');



// create post route for reviews 
router.post('/', 
isLoggedIn, // safty from hopscoths users 
validateReview, 
wrapAsync(reviewController.createReview)
);



// create delete review route 
router.delete('/:reviewId',
    isLoggedIn, // safty from hopscoths users
    isReviewAuthor, // check if the author is the same as the current user
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;