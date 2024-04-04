const mongoose = require('mongoose');

// require data 
const initData = require('./data.js');

// require the listing model
const Listing = require('../models/listing.js');


// Connect to the database
const MONGO_URL= 'mongodb://127.0.0.1:27017/HODOPHILES'; 
// HODOPHILES is the name of the database and this link is copied from the mongodb website 

main()
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}


// function to clean previous data and then insert new data 
const initDB = async () => {
    await Listing.deleteMany({});

    initData.data = initData.data.map((obj)=>(  // this is a map function which will iterate over the data and will add the default image if the image is empty
        { ...obj, owner:"660d27750fc9fe289b98e818"}) // this is the id of the user who is the owner of the listing`
    );

    await Listing.insertMany(initData.data);
    console.log("Data Was initialized");
};

// call the function to initialize the data
initDB();
