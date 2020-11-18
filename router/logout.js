var express = require('express'); 
var router = express.Router();

router.get('/', function(req, res, next) {
    req.session.destroy(function(err){
        if(err) console.error('err',err);
        res.send('<script>alert("로그아웃 완료"); location.href="/";</script>');
    });
});

module.exports = router;
