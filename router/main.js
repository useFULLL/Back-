var express = require('express'); 
var router = express.Router();
var db_config = require('../config/database');
var conn = db_config.init();
// client == conn
db_config.connect(conn);

router.get('/', function(req, res, next) {
    var sql ='select userID,userName,userMoney from user where userID=?';
    var result;
    if(req.session.userID){
        conn.query(sql,req.session.userID,function(err, re){
            if(err){
                console.log('err: ' + err);
            }else{
                result=re;
            }
        });
    }
    res.render('main',{userID: req.session.userID});
});

module.exports = router;
