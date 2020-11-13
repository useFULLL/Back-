var express = require('express'); 
var router = express.Router();
var db_config = require('../config/database');
var conn = db_config.init();
// client == conn
db_config.connect(conn);

var isLogin =0 ;
var user={
    type:'',
    name:'new'
}
userID='shalalastal@naver.com'
type='user';

router.get('/', function(req, res, next) {
    // login하고 넘어오면 isLogin, usertype,업데이트
    // select * from potfolio
    var sql1='SELECT * FROM user;'
    var sql2='SELECT * FROM portfolio;'
    // 로그인 안 한 경우 
    //res.render('main',{isLogin:0});
    // 로그인한 경우
    conn.query(sql1,function(err,results1,field){
        if(err){
            console.log('err2222');
        }
        else{
            var user_data=results1;
            console.log(user_data);
            if(type=='user'){
                conn.query(sql2,function(err,results2,field){
                    if(err){
                        console.log('err3333');
                    }
                    else{
                        var portfolio_data = results2;
                        console.log(portfolio_data);
                        res.render('main',{isLogin:1, type,user_data,portfolio_data});
                    }
                });
            }
            else{
                res.render('main',{isLogin:1,user_data});
            }           
        }
    });
});

module.exports = router;
