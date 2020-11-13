var express = require('express'); 
var router = express.Router();
var db_config = require('../config/database');
var conn = db_config.init();

db_config.connect(conn);
 
router.get('/', function(req, res, next) {
    var sql='SELECT * FROM portfolio;'
    // 로그인 안 한 경우 
    //res.render('main',{isLogin:0});
    // 로그인한 경우
    conn.query(sql,function(err,results,field){
        if(err){
            console.log('err2222');
        }
        else{
            console.log(results);
            var portfolio = results;
            res.render('meme',{portfolio});

                    
        }
    });
});



module.exports = router;