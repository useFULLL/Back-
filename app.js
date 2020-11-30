const express = require('express');
const app = express();
const port = 3000;
const session = require('express-session');

var bodyParser = require('body-parser');
var mainRouter = require('./router/main');
var loginRouter = require('./router/login');
var registerRouter = require('./router/register');
var investRouter = require('./router/invest');
var logoutRouter = require('./router/logout');
var boardRouter = require('./router/board');

//뷰엔진 설정
app.set('view engine','ejs');
app.set('views','./view');
app.use(express.static('public'));

//body-parser설정
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitalized: true
}));

//라우터 설정
app.use('/', mainRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/invest',investRouter);
app.use('/logout',logoutRouter);
app.use('/board',boardRouter);

const server = app.listen(port, () => {
    console.log("Express server has started on port 3000");
});

//크롤링

const {getData, getFund, getTop, getover}=require("./scraper.js");
const cron=require("node-cron");
var result, fund, top, over;

//시가총액순 50개
async function handleAsync(url){
  const rec = await getData(url);
  return rec;
}

//수익률 상위펀드 TOP5
async function handleA(){
  const rec = await getFund();
  return rec;
}

//검색율 상위 100개
async function handleB(){
  const rec = await getTop();
  return rec;
}

//상한가 찍은 것
async function handleC(){
  const rec = await getover();
  return rec;
}

cron.schedule("*/1 * * * * *",async()=>{
  result = await handleAsync("https://finance.naver.com/sise/sise_market_sum.nhn?&page=1");
  var result2 = await handleAsync("https://finance.naver.com/sise/sise_market_sum.nhn?&page=2");
  var result3 = await handleAsync("https://finance.naver.com/sise/sise_market_sum.nhn?&page=3");
  var gfund = await handleA();
  var gtop = await handleB();
  var gover = await handleC();
  for(var i=0;i<result2[0].length;i++){
    result[0].push(result2[0][i]); result[1].push(result2[1][i]);
    result[2].push(result2[2][i]); result[3].push(result2[3][i]);
    result[4].push(result2[4][i]);
  }
  for(var i=0;i<result3[0].length;i++){
    result[0].push(result3[0][i]); result[1].push(result3[1][i]);
    result[2].push(result3[2][i]); result[3].push(result3[3][i]);
    result[4].push(result3[4][i]);
  }
  fund=gfund;top=gtop;over=gover;
});

var db_config = require('./config/database');
var conn = db_config.init();

db_config.connect(conn);

cron.schedule("*/1 * * * * *",async()=>{
  //0 시작 전, 1 진행 중, 2 종료
  //date_format(B.postDate,\'%Y-%m-%d\')
  conn.query("select competitionID, date_format(startDate,\'%Y-%m-%d\') as startDate, date_format(endDate,\'%Y-%m-%d\') as endDate, date_format(now(),\'%Y-%m-%d %H:%i:%s\') as now from competition where status=0",function(err, result){
    if(err){
        console.log('err: ' + err);
    }else{
      if(result[0]){
        for(i=0;i<result.length;i++){
          var competitionID = result[i].competitionID;
          var startDate = result[i].startDate + " 08:30:00";
          var now = result[i].now;
          if(startDate<=now){
            conn.query("update competition set status=1 where competitionID=?",competitionID,function(err, result){
              if(err){
                  console.log('err: ' + err);
              }
            });
          }
        }
      }
    }
  });
  
  conn.query("select competitionID, date_format(startDate,\'%Y-%m-%d\') as startDate, date_format(endDate,\'%Y-%m-%d\') as endDate, date_format(now(),\'%Y-%m-%d %H:%i:%s\') as now from competition where status=1",function(err, result){
    if(err){
        console.log('err: ' + err);
    }else{
      if(result[0]){
        for(i=0;i<result.length;i++){
          var competitionID = result[i].competitionID;
          var endDate = result[i].endDate + " 18:00:00";
          var now = result[i].now;
          if(endDate<=now){
            conn.query("update competition set status=2 where competitionID=?",competitionID,function(err, result){
              if(err){
                  console.log('err: ' + err);
              }
            });
          }
        }
      }
    }
  });
});

//Soketio
const listen = require('socket.io');
const io = listen(server);

io.sockets.on('connection',function(socket){

    socket.interVal = setInterval(() => {
        if(result){
            socket.emit('send',result);
        }
        if(fund){
            socket.emit('sendFund',fund);
        }
        if(top){
            socket.emit('sendTop',top);
        }
        if(over){
            socket.emit('sendOver',over);
        }
    },1000);
});