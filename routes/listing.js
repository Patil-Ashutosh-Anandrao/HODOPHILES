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




// validation for schema middleware 
const validateListing = (req,res,next)=>{
    
    let {error} = listingSchema.validate(req.body); // 
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");// print additional details of error 
        throw new ExpressError(406,errMsg);
    }
    else{
        next();
    }

}





// Create Index Route (fetch datafrom Db and show on webpage)
router.get('/',
        wrapAsync (async (req, res) => {
    const allListings = await Listing.find({}); 
    res.render("listings/index.ejs", { allListings});
})
);





// New Route 
router.get('/new', (req, res) => {
    res.render("listings/new.ejs");
});




// show Route 
router.get('/:id', 
        wrapAsync (async (req, res) => {
    let { id } = req.params;  // extract id
    const listing = await Listing.findById(id).populate("reviews"); // find id and store data in listing
    console.log(id);
    res.render("listings/show.ejs", { listing }); // pass data for listing to show.ejs
})
);




// Create Route type - 2 of validating  schema 
router.post('/', 
    wrapAsync (async (req, res, next) => {

    // extract data from the body of the request
    // const { title, description, price, location, country } = req.body; 
    // insted of this we will use listing array method in new.ejs  like listing[title], listing[description] and so on
    // and use below method 

    const newListing = new Listing (req.body.listing); // extract data from the body of the request    
    await newListing.save(); // save the listing to the database
    res.redirect("/listings"); // redirect to the index route
    
   
})
);


// Edit Route
router.get('/:id/edit', 
        wrapAsync (async (req, res) => {
    let { id } = req.params; // extract id
    const listing = await Listing.findById(id); // find id and store data in listing
    res.render("listings/edit.ejs", { listing }); // pass data for listing to edit.ejs
})
);





// update Route
router.put('/:id', 
        validateListing,
        wrapAsync (async (req, res) => {
            if (!req.body.listing) {
                throw new ExpressError(400, 'Invalid Listing Data');
            }
    let { id } = req.params; // extract id
    await Listing.findByIdAndUpdate(id, { ...req.body.listing  }); // find id and update data in listing
    res.redirect(`/listings/${id}`); // redirect to the show route
})
);


// Delete Route 
router.delete('/:id', 
            wrapAsync (async (req, res) => {
    let { id } = req.params; // extract id
    let deletedListing = await Listing.findByIdAndDelete(id); 
    // find id and delete data in listing

    res.redirect("/listings"); // redirect to the index route
})
);

module.exports = router; // export router