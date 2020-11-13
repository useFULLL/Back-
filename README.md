# Back-


=======
----------------
# DB 생성
- start mysql
- mysql cmd 명령어 실행
1. (first time) create database sedb;
2. use sedb; 
3. create table user(
     userID varchar(30) not null,
     userPW varchar(30) not null,
     userName varchar(30) not null,
     primary key(userID)
     );

-----------------------
# error 해결
1. node app.js 실행 시 , mysql connection error 발생 하는 경우
    * mysql installer 실행
    * MySQL Server의 recofigure 클릭
    * authentication method 나올때까지 next 
    * authentication method 페이지에서 use legacy ~ 선택 후 저장

