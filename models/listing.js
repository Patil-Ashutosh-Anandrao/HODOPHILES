// require mongoose
const mongoose = require('mongoose');

// require review model
const Review = require('./review.js');

// store mongoose schema in schema varialble and use schema variable every where insten of using mongoose.schema 
const Schema = mongoose.Schema;

// create a new schema for our app
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,  // this means that the title is required compulsory
    },

    description: String,
    
    image: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fparenting.firstcry.com%2Farticles%2F15-infant-friendly-holiday-destinations%2F&psig=AOvVaw0WHfImPbbrh79iOh_1yja4&ust=1710059960438000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCLiayPbj5oQDFQAAAAAdAAAAABAG", 
        // if the image is empty/n ull/undefiined then set the default link image
        
        set: (v) => v === "" ? "https://www.google.com/url?sa=i&url=https%3A%2F%2Fparenting.firstcry.com%2Farticles%2F15-infant-friendly-holiday-destinations%2F&psig=AOvVaw0WHfImPbbrh79iOh_1yja4&ust=1710059960438000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCLiayPbj5oQDFQAAAAAdAAAAABAG" : v ,
        // if the image is empty then set the default link image 
    },

    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ] 
});


// to delete reviews of listing when listing is deleted ...!
// letes create a mongoose middleware 
// this is a middleware  which is used to delete the reviews of the listing when the listing is deleted
listingSchema.post('findOneAndDelete', async function (listing) { 
    
    if (listing) {
        await Review.deleteMany({
            _id: {                     // delete all the reviews of the listing
                $in: listing.reviews  // delete all the reviews of the listing
            }
        })
    }
});

// create a new model using the listingschem 
const Listing = mongoose.model('Listing', listingSchema);

// export module to use in another files like app.js
module.exports = Listing;