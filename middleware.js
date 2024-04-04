module.exports.isLoggedIn = (req, res, next) => {

    // check if user is authenticated
    if(!req.isAuthenticated()){
        
        // save original url for redirection 
        
        // from passport use methon of save the original url for redirection
        req.session.redirectUrl = req.originalUrl;

        req.flash('error', 'You must be loged in to create listing !'); // flash message (error)
        return res.redirect('/login'); // redirect to the login route
    }
    next();
};
0
// here above we will using passport method so passport have acess to reset data from redirectUrl variable ... 
// so we will use local variable !

module.exports.saveRedirectUrl = (req, res, next) => {  
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl; // save the original url for redirection
    }
    next();
}