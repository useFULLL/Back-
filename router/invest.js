var express = require('express'); 
var router = express.Router();
var db_config = require('../config/database');
var conn = db_config.init();

db_config.connect(conn);
 
router.get('/', function(req, res, next) {
    res.render('invest',{userID: req.session.userID});
});

router.get('/fail', function(req, res, next) {
    res.render('fail/investlogin_fail',{title:'로그인 실패'});
});

router.post('/buy', function(req, res, next) {
    if(req.session.userID){
        res.redirect('invest/fail');
    }
    var userID = req.session.userID;
    var body = req.body;
    var stockName = body.stockName;
    var amount = body.amount;
    var price = body.price;
    var M;

    conn.query('select max(userstockID) as M form user_stock',function(err, result){
        if(err){
            console.log('err: ' + err);
        }else{
            M=(result.M)*1;
        }
    });

    conn.query('insert into user_stock values(?,?,?,?,?)',[M+1,price,stockName,amount,userID],function(err, result){
        if(err){
            console.log('err: ' + err);
        }else{
            var insertSql = 'update user set userMoney = userMoney-? where userID = ?';
            var params = [M,userID];
            conn.query(insertSql, params, function(err){
                if(err){
                    console.log('err: ' + err);
                }else{
                    res.redirect('/invest');
                }
            });
        }
    });
});

router.post('/sell', function(req, res, next) {
    if(req.session.userID){
        res.redirect('invest/fail');
    }
    
});

module.exports = router;