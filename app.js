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
const { listingSchema, reviewSchema } = require('./schema.js');


// require the Review model
const Review = require('./models/review.js');

// require the listing model
const listings = require('./routes/listing.js');


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
const validateReview = (req,res,next)=>{
    
    let {error} = reviewSchema.validate(req.body); // 
    
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






// use the listing route for all the routes starting with /listings
app.use('/listings', Listing); 




// create post route for reviews 
app.post('/listings/:id/reviews', 
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


    // redirect to the show route
    res.redirect(`/listings/${listing._id}`);
})
);


// create delete review route 
app.delete('/listings/:id/reviews/:reviewId',wrapAsync(async(req,res)=>{
        
        // extract id from url
        let {id, reviewId} = req.params;
    
        // delete review from the listing array
        // $ pull means remove from array which match with gived id reviews:reviewId
        await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    
        // delete review 
        await Review.findByIdAndDelete(reviewId);
    
        // redirect to the show route
        res.redirect(`/listings/${id}`);
    })
);



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




// start the server for execution 
app.listen(8080, () => {
    console.log('Server is running...');
}); 