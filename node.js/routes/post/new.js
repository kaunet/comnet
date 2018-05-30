const express = require('express');
const router = express.Router();

const database = require('../../utils/database');

router.get('/', async function(req, res) {

    let user = req.session.user;

    if (user) {
        res.render('post/new', { user: user });
    } else {
        res.send(`
            <script type="text/javascript">
                alert('쟌넨~ 로그인^^!');
                window.location.href = '/';
            </script>
        `);
    }
});

router.post('/', async function(req, res) {

    let user = req.session.user;
    if (!user) return res.send(`
        <script type="text/javascript">
            alert('쟌넨~ 로그인^^!');
            window.location.href = '/';
        </script>
    `);

    try {
        var conn = await database.getConnection();
        let query = 'INSERT INTO post SET ?';
        let post = {
            Time: new Date(),
            body: req.body.content,
            head: req.body.title,
            category: 'CategoryX',
            ID: user.ID
        };
        await conn.query(query, post);
    }
    catch (error) {
        console.error(error);
    }
    finally {
        await database.releaseConnection(conn);
        res.redirect('/');
    }
});

module.exports = router;