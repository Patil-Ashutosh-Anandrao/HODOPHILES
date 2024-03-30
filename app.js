// require are 


// require the express module
const express = require('express');

// create a new instance of express
const app = express();

// // ***** don't Touch Above 2 lines vimp dont move then any where ***** // // 



// require mongoose
const mongoose = require('mongoose');

// require the listing model
const Listing = require('./models/listing.js');

// require path for views to require all ejs folders path 
const path = require('path');

// require the method-override module
const methodOverride = require('method-override');

// require ejs-mate 
const ejsMate = require('ejs-mate');

//require the wrapAsync module
const wrapAsync = require('./public/util/wrapAsync.js');

// require the ExpressError module
const ExpressError = require('./public/util/ExpressError.js');


// require listingSchema
const { listingSchema } = require('./schema.js');


// require the Review model
const Review = require('./models/review.js');


// Connect to the database
const MONGO_URL= 'mongodb://127.0.0.1:27017/HODOPHILES'; 
// HODOPHILES is the name of the database and this link is copied from the mongodb website 




main()
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}




// set the view engine to ejs
app.set('view engine', 'ejs'); 

// set the views directory
app.set('views', path.join(__dirname, 'views')); 

// to parse the data comes in the body of the request
app.use(express.urlencoded({ extended: true }));

// require the express-session module
app.use(methodOverride('_method'));

// define ejs engine 
app.engine('ejs', ejsMate);

// to use static files from public folder and inside it from css folder 
app.use(express.static(path.join(__dirname, "/public")));





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




// Basic API
app.get('/', (req, res) => {
    res.send('Hello I am Root  ');
});



// Create Index Route (fetch datafrom Db and show on webpage)
app.get('/listings',
        wrapAsync (async (req, res) => {
    const allListings = await Listing.find({}); 
    res.render("listings/index.ejs", { allListings});
})
);





// New Route 
app.get('/listings/new', (req, res) => {
    res.render("listings/new.ejs");
});




// show Route 
app.get('/listings/:id', 
        wrapAsync (async (req, res) => {
    let { id } = req.params;  // extract id
    const listing = await Listing.findById(id); // find id and store data in listing
    console.log(id);
    res.render("listings/show.ejs", { listing }); // pass data for listing to show.ejs
})
);




// // Create Route type -1 of validating  schema 
// app.post('/listings', 
//     wrapAsync (async (req, res, next) => {

//     // extract data from the body of the request
//     // const { title, description, price, location, country } = req.body; 
//     // insted of this we will use listing array method in new.ejs  like listing[title], listing[description] and so on
//     // and use below method 
    
//         if (!req.body.listing) {
//             throw new ExpressError(400, 'Invalid Listing Data');
//         }
//         const newListing = new Listing (req.body.listing); // extract data from the body of the request    
        
//         if (!newListing.title) {
//             throw new ExpressError(401, 'Title is missing');
//         }

//         if (!newListing.description) {
//             throw new ExpressError(402, 'description is missing');
//         }

//         if (!newListing.location) {
//             throw new ExpressError(403, 'location is missing');
//         }
//         await newListing.save(); // save the listing to the database
//         res.redirect("/listings"); // redirect to the index route
   
// })
// );







// Create Route type - 2 of validating  schema 
app.post('/listings', 
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
app.get('/listings/:id/edit', 
        wrapAsync (async (req, res) => {
    let { id } = req.params; // extract id
    const listing = await Listing.findById(id); // find id and store data in listing
    res.render("listings/edit.ejs", { listing }); // pass data for listing to edit.ejs
})
);





// update Route
app.put('/listings/:id', 
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
app.delete('/listings/:id', 
            wrapAsync (async (req, res) => {
    let { id } = req.params; // extract id
    let deletedListing = await Listing.findByIdAndDelete(id); 
    // find id and delete data in listing

    res.redirect("/listings"); // redirect to the index route
})
);



// create post route for reviews 
app.post('/listings/:id/reviews', async(req,res)=>{
    
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


    // redirect to the show route
    res.redirect(`/listings/${listing._id}`);
})





// // Create new route for testing listing
// app.get('/testListing', async (req, res) => {
//     let sampleListings = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 100,
//         location: "Calangute Beach, Goa",
//         country: "India",
//     });

//     //save the listing to the database
//     await sampleListing.save();
//     console.log("Sample Was Saved");
//     res.send("Sample Was Saved successfully");
// });



// // Create new route for testing listing
// // for above urls not match means page not found 
// // so we will write code for that
 app.all('*', (req, res, next) => {
    next(new ExpressError(404,'Page Not Found'));
 });





// middleware for custome error handling 
app.use((err, req, res, next) => {

    // deconstruct the error object
    let {statusCode = 500, message="Something went Wrong !"} = err;

    // send error 
    //res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});

});




// start the server
app.listen(8080, () => {
    console.log('Server is running...');
}); 