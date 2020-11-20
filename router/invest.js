var express = require('express'); 
var router = express.Router();
var db_config = require('../config/database');
var conn = db_config.init();

db_config.connect(conn);
 
router.get('/', function(req, res, next) {
    if(!req.session.userID){
        res.send('<script>alert("로그인이 필요합니다."); location.href="/"</script>');
    }else{
        conn.query('select stockName form user_stock where userID=?',req.session.userID,function(err, result){
            if(err){
                console.log('err: ' + err);
            }else{
                res.render('invest',{userID: req.session.userID,admin: req.session.type, data:result});
            }
        });
    }
});

router.post('/buy', function(req, res, next) {
    var userID = req.session.userID;
    var body = req.body;
    var stockName = body.stockName;
    var amount = body.amount;
    var price = body.price;
    var M;
    var sql;
    var param1;

    conn.query('select max(userstockID) as M form user_stock',function(err, result){
        if(err){
            console.log('err: ' + err);
        }else{
            M=(result.M)*1;
        }
    });

    conn.query('select stockName form user_stock where stockName=?',stockName,function(err, result){
        if(err){
            console.log('err: ' + err);
        }else{
            if(result.stockName){
                sql = 'update user_stock set amount=amount+?, stockPrice=stockPrice+? where stockName=?';
                param1=[amount,price,stockName];
            }else{
                sql = 'insert into user_stock values(?,?,?,?,?)';
                param1=[M+1,price,stockName,amount,userID];
            }
        }
    });

    conn.query(sql,param1,function(err, result){
        if(err){
            console.log('err: ' + err);
        }else{
            var insertSql = 'update user set userMoney = userMoney-? where userID = ?';
            var param2 = [M,userID];
            conn.query(insertSql, param2, function(err){
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
    
});

module.exports = router;