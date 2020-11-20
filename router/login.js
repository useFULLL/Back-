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
    res.render('login',{userID: req.session.userID,userName: req.session.userName,admin: req.session.type});
});

router.post('/', function(req, res, next) {
    var body = req.body;
    var sql = 'SELECT * from user WHERE userID = ? AND userPW = ?';
    if(body.email==""||body.password==""){
        res.send('<script>alert("입력하지 않은 정보가 있습니다."); history.back();</script>');
    }
    var params = [body.email,body.password];
    if(body.isAdmin){
        sql = 'SELECT * from admin WHERE adminID = ? AND adminPW = ?';
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
                    req.session.userName = result.adminName;
                    req.session.type = 'admin';
                }else{
                    req.session.userName = result.userName;
                }
                res.redirect('/');
            }
        }
    });
});

module.exports = router;