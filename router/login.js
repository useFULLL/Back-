var express = require('express'); 
var router = express.Router();
var db_config = require('../config/database');
var conn = db_config.init();

db_config.connect(conn);
 
router.get('/', function(req, res, next) {
    res.render('login');
});

router.post('/', function(req, res, next) {
    var body = req.body;
    var sql = 'SELECT * from user WHERE userID = ? AND userPW = ?';
    var params = [body.email,body.password];

    conn.query(sql,params,function(err, result){
        if(err){
            console.log('err: ' + err);
        }else{
            if(result.length === 0){
                //해당하는 유저를 찾을 수 없다.
            }else{
                req.session.userID = result[0].userID;
                res.redirect('/');
            }
        }
    });
});

module.exports = router;