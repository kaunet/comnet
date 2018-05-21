const express = require('express');
const router = express.Router();

const database = require('../utils/database');
const moment = require('moment');

/* GET post page. */

router.use('/', async function(req, res) {
    let page = req.query.page;
    // if (!page) return res.redirect('/post');

    try {
        var conn = await database.getConnection();
        try {
            // let query = 'SELECT * FROM post'; 
            // idx, title, writer, hit, DATE_FORMAT(moddate, "%Y/%m/%d %T) AS moddate FROM Board';
            // let posts = await conn.query(query);
            
            let recent_posts = ({
                id: "1",
                title: "Computer network so Strong!",
                author: "Sung-Koo",
                status: "completed",
                timestamp: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            });

            res.render('post', {  title: 'Express', posts: recent_posts });
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
