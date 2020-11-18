const { render } = require('ejs');
var express = require('express'); 
var router = express.Router();
var db_config = require('../config/database');
var conn = db_config.init();

db_config.connect(conn);
 
router.get('/', function(req, res, next) {
    if(req.session.userID){
        res.send('<script>alert("이미 로그인 되어 있습니다."); location.href="/"</script>');
    }
    res.render('login',{userID: req.session.userID});
});

router.post('/', function(req, res, next) {
    var body = req.body;
    var sql = 'SELECT * from user WHERE userID = ? AND userPW = ?';
    var params = [body.email,body.password];
    if(body.isAdmin){
        sql = 'SELECT * from admin WHERE userID = ? AND userPW = ?';
    }
    conn.query(sql,params,function(err, result){
        if(err){
            console.log('err: ' + err);
        }else{
            if(result.length == 0){
                res.send('<script>alert("일치하는 정보가 없습니다."); history.back();</script>');
            }else{
                req.session.userID = body.email;
                if(body.isAdmin){
                    req.session.type = 'admin';
                }
                res.redirect('/');
            }
        }
    });
});

module.exports = router;