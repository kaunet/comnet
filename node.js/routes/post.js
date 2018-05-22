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

            // let query = 'SELECT * FROM post'; 
            // idx, title, writer, hit, DATE_FORMAT(moddate, "%Y/%m/%d %T) AS moddate FROM Board';
            // let posts = await conn.query(query);
            
            let recent_posts = [{
                Postid: "1",
                id: "1",
                title: "Computer network so Strong!",
                author: "Sung-Koo",
                status: "completed",
                timestamp: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            }];

            res.render('post', { posts: recent_posts, update: moment().format('YYYY-MM-DD HH:mm:ss') });
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

module.exports = router;
