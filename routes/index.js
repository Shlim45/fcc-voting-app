const express = require('express'),
      router  = express.Router();
      
      
router.get('/', function(req, res) {
    res.render('home', {page: "home"});
});

module.exports = router;