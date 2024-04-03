// require express
const express = require('express');  

// create a new Router
const router = express.Router();


// 
router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
});



//export the router
module.exports = router;