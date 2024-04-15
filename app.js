// require are 

// this is to check the environment is not on production at that time only use .env file 
// and if on production at that time not use .env file 
if(process.env.NODE_ENV != "production") { 
    // require dotenv and configure 
    require('dotenv').config();
}

//print the process.env.secret
//console.log(process.env.SECRET);



// require the express module
const express = require('express');

// create a new instance of express
const app = express();

// // ***** don't Touch Above 2 lines vimp dont move then any where ***** // // 



// require mongoose
const mongoose = require('mongoose');

// require the listing model
// const Listing = require('./models/listing.js');

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

// require express session 
const session = require("express-session");

// require connect mongo 
const MongoStore = require('connect-mongo');


// require listingSchema
const { listingSchema, reviewSchema } = require('./schema.js');


// require the Review model
const Review = require('./models/review.js');

// require the listing model
const listingRouter = require('./routes/listing.js');

// require the review model
const reviewRouter = require('./routes/review.js');

// require the user model
const userRouter = require('./routes/user.js');

// require flash 
const flash = require('connect-flash'); 

// require passport
const passport = require('passport');

// require local strategy
const LocalStrategy = require('passport-local');

// require the User model
const User = require('./models/user.js'); 


// Connect to the database
// const MONGO_URL= 'mongodb://127.0.0.1:27017/HODOPHILES'; 
// HODOPHILES is the name of the database and this link is copied from the mongodb website 

const dbUrl = process.env.ATLASDB_URL; // this is the url of the database 



main()
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log(err));

async function main() {
    // await mongoose.connect(MONGO_URL);
    await mongoose.connect(dbUrl);
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


// use mongo store 
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: "my_super_secret_code";
    },
    touchAfter : 24*3600,
})

store.on("error", ()=> {
    console.log("ERROR in MONGO SESSION STORE", err);
})


// define session options 
const sessionOptions = { 
    store,
    secret: "my_super_secret_code", // this is the secret code to hash the session id
    resave: false, // this is to avoid saving the session again and again
    saveUninitialized: true, // this is to save the session in the database

    cookie:{
        expires: Date.now() + 7 *  24 * 60  * 60 * 1000, // this is to set the expiry time of the cookie
                          //days   hrs  min  sec  milisec  ( after 7 days this cookie will deleted !) 
        
        maxAge : 7 *  24 * 60  * 60 * 1000, // this is to set the max age of the cookie
        httpOnly:true          // this is to make the cookie http only
    }
}


// // Basic API
// app.get('/', (req, res) => {
//     res.send('Hello I am Root  ');
// });

// // use mongo store 
// const store = MongoStore.create({
//     mongoUrl: dbUrl;
//     crypto:{
//         secret: "my_super_secret_code";
//     },
//     touchAfter : 24*3600,
// })



// use the session options
app.use(session(sessionOptions));

// use the flash
app.use(flash());



// implement the passport
app.use(passport.initialize());  // this is to initialize the passport
app.use(passport.session()); // this is to use the passport session
passport.use(new LocalStrategy(User.authenticate())); // this is to use the local strategy 
passport.serializeUser(User.serializeUser()); // this is to serialize the user
passport.deserializeUser(User.deserializeUser()); // this is to deserialize the user

// middleware for flash messages
app.use((req, res, next) => {
    res.locals.success = req.flash('success');// this is to get the success message from the flash

    res.locals.error = req.flash('error'); // this is to get the error message from the flash
    
    res.locals.currUser = req.user; // this is to get the current user info 

    next();
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



// // create route 
// app.get('/demouser', async (req, res) => {
//     const fakeUser = new User({ 
//         email: 'student@gmail.com',
//         username: 'delta-student'
//     });
//     let registeredUser = await User.register(fakeUser, 'helloworld'); // this is static method used to store register the user
//     res.send(registeredUser);
// });




// use the listing route for all the routes starting with /listings
app.use('/listings', listingRouter); 


// use the review route for all the routes starting with /listings/:id/reviews
app.use('/listings/:id/reviews', reviewRouter); 

// use the user route for all the routes starting with /users
app.use('/', userRouter);







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