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
    res.render('competition-create',{userID: req.session.userID,userName: req.session.userName,admin: req.session.type});
});

//대회 생성(admin) - /invest/create (POST)
router.post('/create', function(req, res, next) {
    if(!req.session.type){
        res.send('<script>alert("접근권한이 없습니다."); location.href="/"</script>');
    }else{
        var userID = req.session.userID;
        var body = req.body;
        var startDate = body.startdate;
        var endDate = body.enddate;
        var givenMoney = body.givenmoney;
    
        conn.query('select max(competitionID) as Max from competition',function(err, result){
            if(err){
                console.log('err: ' + err);
            }else{
                if(result){
                    max=(result[0].Max)*1;
                }else{
                    max = 0;
                }
                param = [max+1,startDate,endDate,givenMoney,userID];
            
                conn.query('insert into competition values(?,?,?,0,?,?)',param,function(err, result){
                    if(err){
                        console.log('err: ' + err);
                    }else{
                        res.redirect('/invest');
                    }
                });
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
            }else if(competitionResult[0]){
                conn.query('select * from user_competition_stock where userID=?',req.session.userID,function(err, stockResult){
                    if(err){
                        console.log('err: ' + err);
                    }else{
                        res.render('invest',{userID: req.session.userID,userName: req.session.userName,admin: req.session.type, userData: competitionResult, stockData: stockResult});
                    }
                });
            }else{
                res.send('<script>alert("대회 참여를 먼저 해주세요."); location.href="/invest/"</script>');
            }
        });
    }
});

//대회 참여 - /invest/:id/join
router.get('/:id/join', function(req, res, next) {
    var competitionID = req.params.id;
    if(!req.session.userID){
        res.send('<script>alert("로그인이 필요합니다."); location.href="/"</script>');
    }else{
        conn.query('select * from user_competition where competitionID=? and userID=?',[competitionID,req.session.userID],function(err, competitionResult){
            if(err){
                console.log('err: ' + err);
            }else if(competitionResult[0]){
                res.send('<script>alert("대회에 이미 참여했습니다."); location.href="/invest/"</script>');
            }else{
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
            }
        });
    }
});

//대회 목록 - /invest/:id/result
router.get('/:id/result', function(req, res, next) {
    var competitionID = req.params.id;
    var selfR;
    conn.query('select * from competition where competitionID=?',competitionID,function(err, result){
        if(err){
            console.log('err: ' + err);
        }else{
            if(result[0].status!=2){
                res.send('<script>alert("종료되지 않은 대회입니다."); location.href="/"</script>');
            }else{
                conn.query('select * from user_competition UC join user U on UC.userID=U.userID where competitionID=? order by UC.total',competitionID,function(err, rankResult){
                    if(err){
                        console.log('err: ' + err);
                    }else{
                        conn.query('select * from competition where competitionID = ?',competitionID,function(err, competitionResult){
                            if(err){
                                console.log('err: ' + err);
                            }else if(!req.session.userID){
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
            }
        }
    });
});

//매수
router.post('/:id/buy', function(req, res, next) {
    var competitionID = req.params.id;
    var userID = req.session.userID;
    var body = req.body;
    var stockName = body.stockName;
    var amount = body.amount*1;
    var price = body.price*1;

    conn.query('select total from user_competition where competitionID=? and userID=?',[competitionID,userID],function(err, result){
        if(err){
            console.log('err: ' + err);
        }else{
            var total = result[0].total*1;
            if(total>=amount*price){
                conn.query('select stockName from user_competition_stock where stockName=?',stockName,function(err, result){
                    if(err){
                        console.log('err: ' + err);
                    }else{
                        if(result[0]){
                            conn.query('update user_competition_stock set stockPrice=stockPrice+?,amount=amount+? where stockName=?',[amount*price,amount,result[0].stockName],function(err, result){
                                if(err){
                                    console.log('err: ' + err);
                                }else{
                                    conn.query('update user_competition set total=total-? where competitionID=? and userID=?',[competitionID,userID],function(err, result){
                                        if(err){
                                            console.log('err: ' + err);
                                        }else{
                                            res.send('<script>history.back();</script>');
                                        }
                                    });
                                }
                            });
                        }else{
                            var max;
                            conn.query('select max(userstockID) as MAX from user_competition_stock',function(err, result){
                                if(err){
                                    console.log('err: ' + err);
                                }else{
                                    if(result[0].MAX){
                                        max=result[0].MAX*1;
                                    }else{
                                        max=0;
                                    }
                                    var param=[max+1,amount*price,stockName,amount,competitionID,userID];
                                    conn.query('insert into user_competition_stock values(?,?,?,?,?,?)',param,function(err, result){
                                        if(err){
                                            console.log('err: ' + err);
                                        }else{
                                            conn.query('update user_competition set total=total-? where competitionID=? and userID=?',[competitionID,userID],function(err, result){
                                                if(err){
                                                    console.log('err: ' + err);
                                                }else{
                                                    res.send('<script>history.back();</script>');
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }else{
                res.send('<script>alert("돈이 부족합니다."); history.back();</script>');
            }
        }
    });
});

//매수
router.post('/sell', function(req, res, next) {
    var competitionID = req.params.id;
    var userID = req.session.userID;
    var body = req.body;
    var stockName = body.stockName;
    var amount = body.amount*1;
    var price = body.price*1;

    conn.query('select total from user_competition where competitionID=? and userID=?',[competitionID,userID],function(err, result){
        if(err){
            console.log('err: ' + err);
        }else{

        }
    });
});

module.exports = router;