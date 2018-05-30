const express = require('express');
const router = express.Router();

const database = require('../utils/database');
const moment = require('moment');

router.get('/:id', async function(req, res) {

    let user = req.session.user;

<<<<<<< HEAD
router.use('/:id', async function(req, res) {

=======
>>>>>>> 38815ffd918ce4dde0a9175b847483db645ad688
    let id = req.params.id;
    if (!id) return res.redirect('/');

    try {
        var conn = await database.getConnection();
        await conn.beginTransaction();
        try {
<<<<<<< HEAD

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
=======
            let query1 = 'SELECT * FROM post WHERE PostID = ?';
            let post = (await conn.query(query1, id)).shift();
            
            if (post) {
                let query2 = 'SELECT * FROM comment WHERE PostID = ?';
                post.comments = await conn.query(query2, post.PostID);
                let parallel = post.comments.map(comment => {
                    comment.id = comment.TimeStamp.getTime();
                    comment.TimeStamp = moment(comment.TimeStamp).format('YYYY-MM-DD HH:mm:ss');
>>>>>>> 38815ffd918ce4dde0a9175b847483db645ad688
                });
                await Promise.all(parallel);
                await conn.commit();
                res.render('post', { user: user, post: post, timestamp: moment().format('YYYY-MM-DD HH:mm:ss') });
            } else {
                await conn.destroy();
                res.redirect('/');
            }
<<<<<<< HEAD

            let commentnum = 2; //comment 쿼리문 들어갈것
            res.render('post', { user: user, posts: current_posts,
            comments: current_comments, commentnum: commentnum,
            update: moment().format('YYYY-MM-DD HH:mm:ss') });
        }

=======
        }
>>>>>>> 38815ffd918ce4dde0a9175b847483db645ad688
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

router.delete('/:id/comment', async function(req, res) {

    let user = req.session.user;

    let id = req.params.id;
    let commentId = req.body.commentId;
    console.log('commentId:', commentId);
    
    try {
        var conn = await database.getConnection();
        let query = 'DELETE FROM comment WHERE TimeStamp = ? AND ID = ?';
        let result = await conn.query(query, [commentId, user.ID]);
        console.log('result:', result);
    }
    catch (error) {
        console.error(error);
    }
    finally {
        await database.releaseConnection(conn);
    }

    res.json({ succeed: true, commentId: commentId });
});

module.exports = router;
