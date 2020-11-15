const express = require('express');
const app = express();
const port = 3000;
const session = require('express-session');

var bodyParser = require('body-parser');
var mainRouter = require('./router/main');
var loginRouter = require('./router/login');
var registerRouter = require('./router/register');
var investRouter = require('./router/invest');
var headRouter = require('./router/head');
var bodyjsRouter = require('./router/body-js');
var headerdkRouter = require('./router/header-desktop');
var menusidebarRouter = require('./router/menu-sidebar');

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
app.use('/head', headRouter);
app.use('/body-js',bodyjsRouter);
app.use('/header-desktop',headerdkRouter);
app.use('/menu-sidebar',menusidebarRouter);

app.listen(port, () => {
    console.log("Express server has started on port 3000");
})

app.locals.cdata=require('./local.json');