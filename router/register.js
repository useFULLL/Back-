var express = require('express'); 
var router = express.Router();
var db_config = require('../config/database');
var conn = db_config.init();

db_config.connect(conn);
 
router.get('/', function(req, res, next) {
    if(req.session.userID){
        res.send('<script>alert("이미 로그인 되어 있습니다."); location.href="/"</script>');
    }
    res.render('register',{userID: req.session.userID});
});

router.post('/', function(req, res, next) {
    var body = req.body;
    var sql = 'SELECT * from user WHERE userID = ?';

    conn.query(sql,body.email,function(err, result){
        if(err){
            console.log('err: ' + err);
        }else{
            if(result.length !== 0){
                res.send('<script>alert("이미 존재하는 아이디입니다."); history.back();</script>');
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