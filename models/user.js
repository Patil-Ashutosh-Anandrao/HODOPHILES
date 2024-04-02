// require mongoose
const mongoose = require('mongoose');

// store mongoose schema in schema varialble and use schema variable every where insten of using mongoose.schema 
const Schema = mongoose.Schema;

// require passport-local-mongoose
const passportLocalMongoose = require('passport-local-mongoose');

// create user schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    } 
});


// plug in passport-local-mongoose to userSchema
// this will automatically create username, password, salting and hashing
userSchema.plugin(passportLocalMongoose);

// export module to use in another files like app.js
module.exports = mongoose.model('User', userSchema);