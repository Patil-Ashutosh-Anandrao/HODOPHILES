const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({}); 
    res.render("listings/index.ejs", { allListings});
}


module.exports.renderNewForm =(req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
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
}


module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();

    console.log(response.body.features[0].geometry);
    res.send("done!");

   let url =  req.file.path;
   let filename = req.file.filename;

    // extract data from the body of the request
    // const { title, description, price, location, country } = req.body; 
    // insted of this we will use listing array method in new.ejs  like listing[title], listing[description] and so on
    // and use below method 

    const newListing = new Listing (req.body.listing); // extract data from the body of the request    

    newListing.owner = req.user._id; // add owner to the listing

    newListing.image = {url, filename}; // add url to the listing

    await newListing.save(); // save the listing to the database

    req.flash('success', 'Successfully made a new listing!'); // flash message (success
    
    res.redirect("/listings"); // redirect to the index route  
}


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params; // extract id
    const listing = await Listing.findById(id); // find id and store data in listing

    if(!listing){
        req.flash('error', 'listing you requested for does not exist !'); // flash message (error)
        res.redirect("/listings"); // redirect to the index route
    }

    let originalImageUrl = listing.image.url; // extract url from the listing
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250"); // resize the image

    res.render("listings/edit.ejs", { listing , originalImageUrl }); // pass data for listing to edit.ejs
}


module.exports.updateListing = async (req, res) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, 'Invalid Listing Data');
    // }

let { id } = req.params; // extract id

let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing  }); // find id and update data in listing

if (typeof req.file !== "undefined") { // if file is not undefined 
let url =  req.file.path; // extract url from the file
let filename = req.file.filename; // extract url and filename from the file
listing.image = {url, filename}; // add url to the listing

await listing.save(); // save the listing to the database
}
req.flash('success', 'Successfully  listing Updated  !');

res.redirect(`/listings/${id}`); // redirect to the show route
}


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params; // extract id
    let deletedListing = await Listing.findByIdAndDelete(id); 
    // find id and delete data in listing


    req.flash('success', 'Successfully  listing Deleted !'); 

    res.redirect("/listings"); // redirect to the index route
}