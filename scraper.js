const request = require("request");
const cheerio = require("cheerio");
const iconv=require("iconv-lite");
const charset=require('charset');

/*'info1':'',                 //주식명
  'info2':'',                 //현재가
  'info3':'',                 //전일비
  'info4':'',                 //시가총액
  'info5':'',                 //거래량
  'info6':'',                 //
  'info7':'',                 //
  'info8':''                  //
*/

async function getData(urlInput){
  let result=[];
  return new Promise(resolve=>{
    request({
      //url:"https://finance.naver.com/sise/sise_market_sum.nhn?&page=2"
      url:urlInput
      ,encoding: null
    }
    ,function(err,res,body){
      let resultArr1=[],resultArr2=[],resultArr3=[],resultArr4=[],resultArr5=[],resultArr6=[],resultArr7=[],resultArr8=[];
      const enc=charset(res.headers,body);
      const body1=iconv.decode(body,enc);
      const $=cheerio.load(body1);
      const bodyList = $(".type_2 tbody tr").map(function (i,element){
        let a=$(element).find('td:nth-of-type(2)').text().replace(/([\t|\n|\s])/gi,"");
        if(a!=''){
          resultArr1.push(a);
          resultArr2.push($(element).find('td:nth-of-type(3)').text().replace(/([\t|\n|\s])/gi,""));
          resultArr3.push($(element).find('td:nth-of-type(5)').text().replace(/([\t|\n|\s])/gi,""));
          resultArr4.push($(element).find('td:nth-of-type(7)').text().replace(/([\t|\n|\s])/gi,""));
          resultArr5.push($(element).find('td:nth-of-type(10)').text().replace(/([\t|\n|\s])/gi,""));
          //resultArr6.push($(element).find('td:nth-of-type(4)').text().replace(/([\t|\n|\s])/gi,""));
          //resultArr7.push($(element).find('td:nth-of-type(6)').text().replace(/([\t|\n|\s])/gi,""));
          //resultArr8.push($(element).find('td:nth-of-type(11)').text().replace(/([\t|\n|\s])/gi,""));
        }
      });
      result.push(resultArr1); result.push(resultArr2); result.push(resultArr3); result.push(resultArr4);
      result.push(resultArr5); //result.push(resultArr6); //result.push(resultArr7); //result.push(resultArr8);
      //console.log(result);
      resolve(result);
    });
  });
}

module.exports={getData};