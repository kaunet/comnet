
const express = require('express');
const router = express.Router();

const database = require('../utils/database');
const moment = require('moment');

// Board

router.use('/', async function(app,fs) {
  // let user = req.session.user;
  // console.log('user:', user);
  var conn = await database.getConnection();

  //게시글 읽기
  app.get('/BoardView/:BoardID', function(req,res){
    database.query('BoardID = ?', [req.params.BoardID], function(err,result){
      if(err){
        console.log('Boardview Error');
      }else {
        fs.readFile(__dirnmae + "/../views/Board_View.ejs", 'utf8', function(err, data){
          if(err){
            console.log('Boardview Error');
          }else{
            res.writeHead(200,{'Content-Type'.'text/ejs'});
            res.end(data);
          }
        });
      }
    });
  });

  //게시글 삭제
  app.get('/BoardDelete/:BoardID', function(req,res){
    database.query('delete from products where id = ?', [req.params.BoardID], function(err,result){
      if(err){
        console.log('Delete Error');
      }else {
        console.log('delete id = %d', req.params.BoardID);
        res.redirect('/../views/board/Board_Delete.ejs');
        res.redirect('/');
      }
    });
  });

  //게시글쓰기
  app.use(bodyParser.urlencoded({ extended: true }));
  app.get('/BoardWrite', function(req,res){
    var result = {  };
    let boardID = req.params.boardID;
    fs.readFile(__dirname + "/../views/board/Board_Write.ejs", 'utf8', function(err, data){
      // var users = JSON.parse(data);
      if(err){
        console.log('readFile Error');
      }else{
        res.send(data);
        fs.writeFile(__dirname + "/../utils/database.js", JSON.stringify(users, null, '\t'), "utf8", function(err, data){
            result = {"success": 1};
            res.json(result);
        });
      }
    });
  });

  //게시글 수정
  app.get('/BoardUpdate/:BoardID', function(req,res){
    fs.readFile(__dirname + "/../views/board/Board_Edit.ejs", 'utf8', function(err,data){
      if(err){
        console.log('readFile Error');
      }else{
        res.send( ejs.render(data, {
          product : result[0]
        }));
        fs.readFile(__dirname + "/../utils/database.js", JSON.stringfy(users, null, '\t'), "utf8", function(err, data){
          result = {"success": 1};
          res.json(result);
        });
      }
    });
  });

});
