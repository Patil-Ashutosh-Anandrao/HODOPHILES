module.exports.isLoggedIn = (req, res, next) => {

    // check if user is authenticated
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be loged in to create listing !'); // flash message (error)
        return res.redirect('/login'); // redirect to the login route
    }
    next();
}