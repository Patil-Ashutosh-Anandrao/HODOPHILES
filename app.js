// require are 

// require the express module
const express = require('express');

// require mongoose
const mongoose = require('mongoose');

// require the listing model
const Listing = require('./models/listing.js');

// require path for views to require all ejs folders path 
const path = require('path');









// create a new instance of express
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs'); 
// set the views directory
app.set('views', path.join(__dirname, 'views')); 

// to parse the data comes in the body of the request
app.use(express.urlencoded({ extended: true }));





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







// Basic API
app.get('/', (req, res) => {
    res.send('Hello I am Root  ');
});



// start the server
app.listen(8080, () => {
    console.log('Server is running...');
}); 