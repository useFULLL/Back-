var express = require('express'); 
var router = express.Router();
var db_config = require('../config/database');
var conn = db_config.init();

db_config.connect(conn);

//대회 목록 - /invest/
router.get('/', function(req, res, next) {
    if(req.session.userID){
        conn.query('select *, if(exists(select * from user_competition UC where UC.competitionID=C.competitionID and UC.userID=?),1,0) as joined from competition C',req.session.userID,function(err, result){
            if(err){
                console.log('err: ' + err);
            }else{
                res.render('competition-list',{userID: req.session.userID,userName: req.session.userName,admin: req.session.type, competitionData: result});
            }
        });
    }else{
        conn.query('select *,0 as joined from competition',function(err, result){
            if(err){
                console.log('err: ' + err);
            }else{
                res.render('competition-list',{userID: req.session.userID,userName: req.session.userName,admin: req.session.type, competitionData: result});
            }
        });
    }
});

//대회 생성(admin) - /invest/create (GET)
router.get('/create', function(req, res, next) {
    if(!req.session.type){
        res.send('<script>alert("접근권한이 없습니다."); location.href="/"</script>');
    }
    res.render('create',{userID: req.session.userID,userName: req.session.userName,admin: req.session.type});
});

router.post('/create', function(req, res, next) {
    if(req.session.userID){
        conn.query('select *, if(exists(select * from user_competition UC where UC.competitionID=C.competitionID and UC.userID=?),1,0) as joined from competition C',req.session.userID,function(err, result){
            if(err){
                console.log('err: ' + err);
            }else{
                res.render('competition-list',{userID: req.session.userID,userName: req.session.userName,admin: req.session.type, competitionData: result});
            }
        });
    }else{
        conn.query('select *,0 as joined from competition',function(err, result){
            if(err){
                console.log('err: ' + err);
            }else{
                res.render('competition-list',{userID: req.session.userID,userName: req.session.userName,admin: req.session.type, competitionData: result});
            }
        });
    }
});

//대회 매매 페이지 - /invest/:id/
router.get('/:id', function(req, res, next) {
    var competitionID = req.params.id;
    if(!req.session.userID){
        res.send('<script>alert("로그인이 필요합니다."); location.href="/"</script>');
    }else{
        conn.query('select * from user_competition where competitionID=? and userID=?',[competitionID,req.session.userID],function(err, competitionResult){
            if(err){
                console.log('err: ' + err);
            }else if(competitionResult){
                res.send('<script>alert("대회 참여를 먼저 해주세요."); location.href="/invest/"</script>');
            }else{
                conn.query('select * from user_competition_stock where userID=?',req.session.userID,function(err, stockResult){
                    if(err){
                        console.log('err: ' + err);
                    }else{
                        res.render('invest',{userID: req.session.userID,userName: req.session.userName,admin: req.session.type, userData: competitionResult, stockData: stockResult});
                    }
                });
            }
        });
    }
});

//대회 참여 - /invest/:id/join
router.get('/:id', function(req, res, next) {
    var competitionID = req.params.id;
    if(!req.session.userID){
        res.send('<script>alert("로그인이 필요합니다."); location.href="/"</script>');
    }else{
        conn.query('select * from user_competition where competitionID=? and userID=?',[competitionID,req.session.userID],function(err, competitionResult){
            if(err){
                console.log('err: ' + err);
            }else if(competitionResult){
                conn.query('select givenMoney from competition where competitionID=?',competitionID,function(err, cResult){
                    if(err){
                        console.log('err: ' + err);
                    }else{
                        var givenMoney = cResult[0].givenMoney;
                        var param = [req.session.userID,competitionID,givenMoney];
                        conn.query('insert into user_competition values(?,?,?)',param,function(err, result){
                            if(err){
                                console.log('err: ' + err);
                            }else{
                                res.redirect('/invest');
                            }
                        });
                    }
                });
            }else{
                res.send('<script>alert("대회에 이미 참여했습니다."); location.href="/invest/"</script>');
            }
        });
    }
});

//대회 목록 - /invest/:id/result
router.get('/:id/result', function(req, res, next) {
    var competitionID = req.params.id;
    var selfR;
    conn.query('select U.userName, C.userID, sum(C.stockPrice) as haveMoney from competition C join user U on C.userID=U.userID group by userID order by haveMoney',function(err, rankResult){
        if(err){
            console.log('err: ' + err);
        }else{
            conn.query('select * from competition where competitionID = ?',competitionID,function(err, competitionResult){
                if(err){
                    console.log('err: ' + err);
                }else if(req.session.userID){
                    res.render('competition',{userID: req.session.userID,admin: req.session.type, competitionData:competitionResult, rankData: rankResult, selfData: selfR});
                }else{
                    conn.query('select total from user_competition where competitionID=? and userID=?',[competitionID,req.session.userID],function(err, selfResult){
                        if(err){
                            console.log('err: ' + err);
                        }else{
                            res.render('competition',{userID: req.session.userID,admin: req.session.type, competitionData:competitionResult, rankData: rankResult, selfData: selfResult});
                        }
                    });
                }
            });
        }
    });
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

    conn.query('select max(userstockID) as M from user_stock',function(err, result){
        if(err){
            console.log('err: ' + err);
        }else{
            M=(result.M)*1;
        }
    });

    conn.query('select stockName from user_stock where stockName=?',stockName,function(err, result){
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