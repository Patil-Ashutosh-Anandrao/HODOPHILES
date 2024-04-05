// require express
const express = require('express');  

// create a new Router
const router = express.Router();

// require the user model
const User = require('../models/user.js');

// require the wrapAsync module
const wrapAsync = require('../public/util/wrapAsync.js');

// require passport
const passport = require('passport');

// require saveRedirectUrl 
const { saveRedirectUrl } = require('../middleware.js');

//require the user controller
const userController = require('../controllers/users.js');


// code for router route 
router
.route('/signup')
.get(userController.renderSignupForm)
.post(wrapAsync( userController.signup));

// code for router . rpoute 
router
.route('/login')
.get( userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local", 
                            { failureFlash: true, failureRedirect: '/login' }
                        ),// authenticate user 
    userController.login
);

// router for logout user 
router.get('/logout', userController.logout);


// // create router for login 
// router.get('/signup',userController.renderSignupForm);


// // create a new user
// router.post('/signup',
//     wrapAsync( userController.signup));


// // router for log in user 
// router.get('/login', userController.renderLoginForm);


// router.post('/login',
//     saveRedirectUrl,
//     passport.authenticate("local", 
//                             { failureFlash: true, failureRedirect: '/login' }
//                         ),// authenticate user 
//     userController.login
// );




//export the router
module.exports = router;