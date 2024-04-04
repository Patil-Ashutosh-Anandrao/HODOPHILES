const Listing = require('./models/listing'); // require the listing model

const Review = require('./models/review'); // require the Review model

// require the ExpressError module
const ExpressError = require('./public/util/ExpressError.js');


// require listingSchema
const { listingSchema, reviewSchema } = require('./schema.js');

module.exports.isLoggedIn = (req, res, next) => {

    // check if user is authenticated
    if(!req.isAuthenticated()){
        
        // save original url for redirection 
        
        // from passport use methon of save the original url for redirection
        req.session.redirectUrl = req.originalUrl;

        req.flash('error', 'You must be loged in to create listing !'); // flash message (error)
        return res.redirect('/login'); // redirect to the login route
    }
    next();
};
0
// here above we will using passport method so passport have acess to reset data from redirectUrl variable ... 
// so we will use local variable !

module.exports.saveRedirectUrl = (req, res, next) => {  
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl; // save the original url for redirection
    }
    next();
}


// middleware for authentication of user and woner  for delete and edit listing 
module.exports.isOwner = async (req, res, next) => {

    let { id } = req.params; // extract id
    
    let listing = await Listing.findById(id); // find id and store data in listing
    if(!listing.owner_id.equals(res.locals.currUser._id)){// check if the owner of the listing is the current user
        req.flash('error', 'You are not the owner of this listing !'); // flash message (error)
        return res.redirect(`/listings/${id}`); // redirect to the show route
    } 
    next();
}



// validation for schema middleware 
module.exports.validateListing = (req,res,next)=>{
    
    let {error} = listingSchema.validate(req.body); // 
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");// print additional details of error 
        throw new ExpressError(406,errMsg);
    }
    else{
        next();
    }

}




// validation for schema middleware 
module.exports.validateReview = (req,res,next)=>{
    
    let {error} = reviewSchema.validate(req.body); // 
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");// print additional details of error 
        throw new ExpressError(406,errMsg);
    }
    else{
        next();
    }

}


module.exports.isReviewAuthor = async (req, res, next) => {

    let { id, reviewId } = req.params; // extract id
    
    let review = await Review.findById(reviewId); // find id and store data in listing
    if(!review.author.equals(res.locals.currUser._id)){// check if the owner of the listing is the current user
        req.flash('error', 'You are not the auther of this Review !'); // flash message (error)
        return res.redirect(`/listings/${id}`); // redirect to the show route
    } 
    next();
}