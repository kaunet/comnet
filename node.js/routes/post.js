const express = require('express');
const router = express.Router();

const database = require('../utils/database');
const moment = require('moment');

/* GET post page. */

router.use('/:id', async function(req, res) {
    
    let id = req.params.id;
    if (!id) return res.redirect('/');

    try {
        var conn = await database.getConnection();
        try {
    
            // 포스트 db 접속
            // let query = 'SELECT * FROM post WHERE '+ id +'= post.PostID'; 
            // let query_comment = 'SELECT * FROM comment WHERE'+ id +'= post.PostID';
            
            // let posts = await conn.query(query);
            // let posts_comments = await conn.query(query);
            // consloe.log('posts:',posts);
            // consloe.log('posts:',posts);
            let user = req.session.user;

            let query = 'SELECT * FROM user';
			console.log('query:', query);
			let users = await conn.query(query);
			console.log('users:', users);


            let current_posts = [{
                // Postid: id,
                id: "1",
                title: "Computer network so Strong!",
                author: "Sung-Koo",
                status: "completed",
                // commentsnum: "1",
                timestamp: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }];

            let current_comments = [];
            for(let i =0; i<2; i++){ //i 의 한계는 comment 갯수까지
                current_comments.push({
                    id : "tomksg@naver.com",
                    commentbody : "comment 내용",
					timestamp: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                });
            }
            
            let commentnum = 2; //comment 쿼리문 들어갈것 
            res.render('post', { user: user, posts: current_posts, 
            comments: current_comments, commentnum: commentnum,
            update: moment().format('YYYY-MM-DD HH:mm:ss') });
        }
        
        catch (error) {
            throw error;
        }
    }
    catch (error) {
        console.log('error:', error);
        res.redirect('/');
    }
    finally {
        await database.releaseConnection(conn);
    }
});

router.post

module.exports = router;
