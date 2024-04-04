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


// create router for login 
router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
});



// create a new user
router.post('/signup',
    wrapAsync( async (req, res) => { 
        try { 
            let {  username, email, password } = req.body; // extract data from the body of the request

            // create a new user
            const newUser = new User({ email, username });
        
            // register new user inside DB 
            const registeredUser = await User.register(newUser, password);
            console.log(registeredUser);
        
            req.login(registeredUser, err => { // callback function from passport
                if(err) {
                    return next(err);
                }
                // flash message 
                req.flash('success', 'Welcome !');
            
                // redirect
                res.redirect('/listings');
            });            
            }
            catch(e) {
                req.flash('error', e.message);
                res.redirect('/signup');
            }
}));


// router for log in user 
router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

router.post('/login',
    saveRedirectUrl,
    passport.authenticate("local", { failureFlash: true, failureRedirect: '/login' }),// authenticate user 
     async (req, res) => {
        req.flash('success', 'Welcome back!');
    
        let redirectUrl = req.locals.redirectUrl || '/listings'; // redirect to the original url
        res.redirect(redirectUrl);
    }
);


// router for logout user 
router.get('/logout', (req, res) => {
    req.logout ( (err)=>{ // callback function from passport
        if(err){
            return next(err);
        }
    req.flash('success', 'You LoggedOut !');
    res.redirect('/listings');
})
});




//export the router
module.exports = router;