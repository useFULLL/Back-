var express = require('express'); 
var router = express.Router();
var db_config = require('../config/database');
var conn = db_config.init();
// client == conn
db_config.connect(conn);

router.get('/', function(req, res, next) {
    var sql ='select CS.userstockID, CS.stockPrice, CS.stockName, CS.amount from user U, competition C, user_competition_stock CS where U.userID=? and C.status=1 and CS.competitionID=C.competitionID';
    var stockResult = "";
    if(req.session.userID){
        if(req.session.type){
            var sql ='select CS.userstockID, CS.stockPrice, CS.stockName, CS.amount from admin A, competition C, user_competition_stock CS where A.adminID=? and C.status=1 and CS.competitionID=C.competitionID';
        }
        console.log(req.session.userID);
        conn.query(sql,req.session.userID,function(err, result){
            if(err){
                console.log('err: ' + err);
            }else{
                stockResult=result;
            }
        });
    }
    res.render('main',{userID: req.session.userID,userName: req.session.userName,admin: req.session.type, stockInfo: stockResult});
});

module.exports = router;
