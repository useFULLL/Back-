var express = require('express'); 
var router = express.Router();
var db_config = require('../config/database');
var conn = db_config.init();
// client == conn
db_config.connect(conn);

router.get('/', function(req, res, next) {
    res.render('main',{userID: req.session.userID});
});

module.exports = router;
