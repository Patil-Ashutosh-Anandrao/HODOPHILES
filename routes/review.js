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
const {validateReview} = require('../middleware.js');


// require the listing model
const Listing = require('../models/listing.js');

// require the Review model
const Review = require('../models/review.js');






// create post route for reviews 
router.post('/', 
validateReview, 
wrapAsync(async(req,res)=>{
    
    //access the listing from id 
    let listing = await Listing.findById(req.params.id);

    // create new review
    let newReview = new Review(req.body.review);

    // push the review to the listing
    listing.reviews.push(newReview);

    // save 
    await newReview.save();
    await listing.save();

    // console.log("New Review Saved");
    // res.send("New Review Saved");

    // flash message
    req.flash('success','New Review Saved');

    // redirect to the show route
    res.redirect(`/listings/${listing._id}`);
})
);



// create delete review route 
router.delete('/:reviewId',wrapAsync(async(req,res)=>{
        
    // extract id from url
    let {id, reviewId} = req.params;

    // delete review from the listing array
    // $ pull means remove from array which match with gived id reviews:reviewId
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});

    // delete review 
    await Review.findByIdAndDelete(reviewId);

    // flash message
    req.flash('success','Review Deleted !');

    // redirect to the show route
    res.redirect(`/listings/${id}`);
})
);

module.exports = router;