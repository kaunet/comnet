const express = require('express');
const router = express.Router();

const database = require('../../utils/database');
const multer = require('../../utils/s3').upload;

router.get('/', async function(req, res) {

    let user = req.session.user;

    if (user) {
        res.render('post/new', { user: user });
    } else {
        res.send(`
            <script type="text/javascript">
                alert('로그인이 필요합니다.');
                window.location.href = '/login';
            </script>
        `);
    }
});

router.post('/', multer.single('file'), async function(req, res) {

    let user = req.session.user;
    if (!user) return res.send(`
        <script type="text/javascript">
            alert('로그인이 필요합니다.');
            window.location.href = '/login';
        </script>
    `);

    console.log('req.file:', req.file);

    try {
        var conn = await database.getConnection();
        await conn.beginTransaction();
        try {
            let query1 = 'INSERT INTO post SET ?';
            let timestamp = new Date();
            let post = {
                Time: timestamp,
                body: req.body.content,
                head: req.body.title,
                category: 'CategoryX',
                ID: user.ID
            };
            await conn.query(query1, post);
            if (req.file.location) {
                // TODO
                console.log('req.file.location:', req.file.location);
                let query2 = 'SELECT PostID FROM post ORDER BY PostID DESC';
                let postIds = await conn.query(query2);
                let postId = 1;
                if (postIds.length > 0) postId = postIds[0].PostID;
                let query3 = 'INSERT INTO file SET ?';
                let file = {
                    url: req.file.location,
                    PostID: postId
                };
                await conn.query(query3, file);
            }
            await conn.commit();
        }
        catch (error) {
            throw error;
        }
    }
    catch (error) {
        await conn.rollback();
        console.error(error);
    }
    finally {
        await database.releaseConnection(conn);
        res.redirect('/');
    }
});

module.exports = router;