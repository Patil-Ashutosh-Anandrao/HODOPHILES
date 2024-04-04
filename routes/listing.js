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



// Create Index Route (fetch datafrom Db and show on webpage)
router.get('/',wrapAsync (listingsController.index));





// New Route 
router.get('/new', 
    isLoggedIn,
    (req, res) => {
    res.render("listings/new.ejs");
});




// show Route 
router.get('/:id', 
        wrapAsync (async (req, res) => {
    let { id } = req.params;  // extract id
    const listing = await Listing.findById(id)  // find id and store data in listing
    
    .populate({path : "reviews",
                        populate:{
                            path:"author"
                        },
                    })// populate reviews data with path 
    .populate("owner"); // populate owner data also
    
    // console.log(id);

    if(!listing){
        req.flash('error', 'listing you requested for does not exist !'); // flash message (error)
        res.redirect("/listings"); // redirect to the index route
    }

    res.render("listings/show.ejs", { listing }); // pass data for listing to show.ejs
})
);




// Create Route type - 2 of validating  schema 
router.post('/', 
    // validateListing,
    isLoggedIn,
    wrapAsync (async (req, res, next) => {

    // extract data from the body of the request
    // const { title, description, price, location, country } = req.body; 
    // insted of this we will use listing array method in new.ejs  like listing[title], listing[description] and so on
    // and use below method 

    const newListing = new Listing (req.body.listing); // extract data from the body of the request    

    newListing.owner = req.user._id; // add owner to the listing

    await newListing.save(); // save the listing to the database

    req.flash('success', 'Successfully made a new listing!'); // flash message (success
    
    res.redirect("/listings"); // redirect to the index route
    
   
})
);


// Edit Route
router.get('/:id/edit', 
        isLoggedIn,
        isOwner,
        wrapAsync (async (req, res) => {
    let { id } = req.params; // extract id
    const listing = await Listing.findById(id); // find id and store data in listing

    if(!listing){
        req.flash('error', 'listing you requested for does not exist !'); // flash message (error)
        res.redirect("/listings"); // redirect to the index route
    }

    
    res.render("listings/edit.ejs", { listing }); // pass data for listing to edit.ejs
})
);





// update Route
router.put('/:id', 
        isLoggedIn,
        isOwner,
        validateListing,
        wrapAsync (async (req, res) => {
            if (!req.body.listing) {
                throw new ExpressError(400, 'Invalid Listing Data');
            }
    
    let { id } = req.params; // extract id
    
    await Listing.findByIdAndUpdate(id, { ...req.body.listing  }); // find id and update data in listing
   
    req.flash('success', 'Successfully  listing Updated  !');

    res.redirect(`/listings/${id}`); // redirect to the show route
})
);


// Delete Route 
router.delete('/:id', 
            isLoggedIn,
            isOwner,
            wrapAsync (async (req, res) => {
    let { id } = req.params; // extract id
    let deletedListing = await Listing.findByIdAndDelete(id); 
    // find id and delete data in listing


    req.flash('success', 'Successfully  listing Deleted !'); 

    res.redirect("/listings"); // redirect to the index route
})
);

module.exports = router; // export router