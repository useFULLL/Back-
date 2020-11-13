const { render } = require('ejs');
var express = require('express'); 
var router = express.Router();
var db_config = require('../config/database');
var conn = db_config.init();

db_config.connect(conn);
 
router.get('/', function(req, res, next) {
    res.render('login',{userID: req.session.userID});
});

router.get('/fail', function(req, res, next) {
    res.render('fail/login_fail',{title:'로그인 실패'});
});

router.post('/', function(req, res, next) {
    var body = req.body;
    var sql = 'SELECT * from user WHERE userID = ? AND userPW = ?';
    var params = [body.email,body.password];

    conn.query(sql,params,function(err, result){
        if(err){
            console.log('err: ' + err);
        }else{
            if(result.length == 0){
                res.redirect('/login/fail');
            }else{
                req.session.userID = body.email;
                res.redirect('/');
            }
        }
    });
});

module.exports = router;