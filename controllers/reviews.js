// require listing model 
const Listing = require('../models/listing.js');

// require review model
const Review = require('../models/review.js');




module.exports.createReview = async(req,res)=>{
    
    //access the listing from id 
    let listing = await Listing.findById(req.params.id);

    // create new review
    let newReview = new Review(req.body.review);

    // store author if there is new review 
    newReview.author=req.user._id;

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
};




module.exports.destroyReview = async(req,res)=>{
        
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
};