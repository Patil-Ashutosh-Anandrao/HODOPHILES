// require mongoose
const mongoose = require('mongoose');

// store mongoose schema in schema varialble and use schema variable every where insten of using mongoose.schema 
const Schema = mongoose.Schema;

// create review schema
const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now() // this will set the current date and time
    },
    // for reviews 
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// export module to use in another files like app.js
module.exports = mongoose.model('Review', reviewSchema);