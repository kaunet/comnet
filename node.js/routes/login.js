const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

    res.render('login');
});

router.post('/', (req, res) => {

    let { email, password } = req.body;
    console.log('email:', email);
    console.log('password:', password);

    // check database
    if (email) {
        req.session.user = { name: email };
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

module.exports = router;