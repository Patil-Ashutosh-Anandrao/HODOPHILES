const User = require('../models/user'); // import User model


module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs');
};

module.exports.signup = async (req, res) => { 
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
};


module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs');
};


module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back!');

    let redirectUrl = res.locals.redirectUrl || '/listings'; // redirect to the original url
    res.redirect(redirectUrl);
};


module.exports.logout = (req, res, next) => {
    req.logout ( (err)=>{ // callback function from passport
        if(err){
            return next(err);
        }
    req.flash('success', 'You LoggedOut !');
    res.redirect('/listings');
})
};