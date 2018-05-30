const express = require('express');
const router = express.Router();

const database = require('../../utils/database');
const moment = require('moment');

router.use('/new', require('./new'));

router.get('/:id', async function(req, res) {

    let user = req.session.user;

    let id = req.params.id;
    if (!id) return res.redirect('/');

    try {
        var conn = await database.getConnection();
        await conn.beginTransaction();
        try {
            let query1 = 'SELECT * FROM post WHERE PostID = ?';
            let post = (await conn.query(query1, id)).shift();
            
            if (post) {
                let query2 = 'SELECT * FROM comment WHERE PostID = ?';
                post.comments = await conn.query(query2, post.PostID);
                let parallel = post.comments.map(comment => {
                    comment.id = comment.TimeStamp.getTime();
                    comment.TimeStamp = moment(comment.TimeStamp).format('YYYY-MM-DD HH:mm:ss');
                });
                await Promise.all(parallel);
                await conn.commit();
                res.render('post', { user: user, post: post, timestamp: moment().format('YYYY-MM-DD HH:mm:ss') });
            } else {
                await conn.destroy();
                res.redirect('/');
            }
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

router.delete('/:id/comment', async function(req, res) {

    let user = req.session.user;

    let id = req.params.id;
    let commentId = req.body.commentId;
    console.log('commentId:', commentId);
    
    try {
        var conn = await database.getConnection();
        let query = 'DELETE FROM comment WHERE ID = ?';
        let result = await conn.query(query, [user.ID]);
        console.log('result:', result);
        console.log('commentId:', user.ID);
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