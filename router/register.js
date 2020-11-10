var express = require('express'); 
var router = express.Router();
var db_config = require('../config/database');
var conn = db_config.init();

db_config.connect(conn);
 
router.get('/', function(req, res, next) {
    res.render('register');
});

router.post('/', function(req, res, next) {
    var body = req.body;
    var sql = 'SELECT * from user WHERE userID = ?';

    conn.query(sql,body.email,function(err, result){
        if(err){
            console.log('err: ' + err);
        }else{
            if(result.length !== 0){
                //유저가 이미 존재한다.
            }else{
                var insertSql = 'INSERT INTO user VALUES(?,?,?)';
                var params = [body.email,body.password,body.username];
                conn.query(insertSql, params, function(err){
                    if(err){
                        console.log('err: ' + err);
                    }else{
                        res.redirect('/');
                    }
                });
            }
        }
    });
});

module.exports = router;