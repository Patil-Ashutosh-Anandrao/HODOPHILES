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

// define ejs engine 
app.engine('ejs', ejsMate);

// require the express-session module
app.use(methodOverride('_method'));







// set the view engine to ejs
app.set('view engine', 'ejs'); 
// set the views directory
app.set('views', path.join(__dirname, 'views')); 

// to parse the data comes in the body of the request
app.use(express.urlencoded({ extended: true }));



// to use static files from public folder and inside it from css folder 
app.use(express.static(path.join(__dirname, "/public")));





// Connect to the database
const MONGO_URL= 'mongodb://127.0.0.1:27017/HODOPHILES'; 
// HODOPHILES is the name of the database and this link is copied from the mongodb website 

main()
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

// Create Index Route (fetch datafrom Db and show on webpage)
app.get('/listings', async (req, res) => {
    const allListings = await Listing.find({}); 
    res.render("listings/index.ejs", { allListings});
});





// New Route 
app.get('/listings/new', (req, res) => {
    res.render("listings/new.ejs");
});



// Create Route
app.post('/listings', async (req, res, next) => {

    // extract data from the body of the request
    // const { title, description, price, location, country } = req.body; 
    // insted of this we will use listing array method in new.ejs  like listing[title], listing[description] and so on
    // and use below method 
    try{
        let newListing = new Listing (req.body.listing); // extract data from the body of the request    
        await newListing.save(); // save the listing to the database
        res.redirect("/listings"); // redirect to the index route
    } 
    catch (err) {
        next(err);
    } 

});



// Edit Route
app.get('/listings/:id/edit', async (req, res) => {
    let { id } = req.params; // extract id
    const listing = await Listing.findById(id); // find id and store data in listing
    res.render("listings/edit.ejs", { listing }); // pass data for listing to edit.ejs
});





// update Route
app.put('/listings/:id', async (req, res) => {
    let { id } = req.params; // extract id
    await Listing.findByIdAndUpdate(id, { ...req.body.listing  }); // find id and update data in listing
    res.redirect(`/listings/${id}`); // redirect to the show route
});


// Delete Route 
app.delete('/listings/:id', async (req, res) => {
    let { id } = req.params; // extract id
    let deletedListing = await Listing.findByIdAndDelete(id); 
    // find id and delete data in listing

    res.redirect("/listings"); // redirect to the index route
});



// show Route 
app.get('/listings/:id', async (req, res) => {
    let { id } = req.params;  // extract id
    const listing = await Listing.findById(id); // find id and store data in listing
    console.log(id);
    res.render("listings/show.ejs", { listing }); // pass data for listing to show.ejs
});



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



// middleware for custome error handling 
app.use((err, req, res, next) => {
    res.send("Something went Wrong !");
});





// Basic API
app.get('/', (req, res) => {
    res.send('Hello I am Root  ');
});



// start the server
app.listen(8080, () => {
    console.log('Server is running...');
}); 