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
                alert('ganene!');
                window.location.href = 'http://localhost:3000';
            </script>
        `);
    }
});

router.post('/', async function(req, res) {

    let user = req.session.user;

    console.log('user:', user);

    res.json(req.body);
    // res.redirect('/');
});

module.exports = router;