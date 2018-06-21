const express = require('express');
const router = express.Router();

const crypto = require('crypto');

const database = require('../utils/database');

router.get('/', (req, res) => {
    res.render('signup');
});

router.post('/', async (req, res) => {

    let { email, password } = req.body;

    // 1 sec
    for (let i = 0; i < 100; i++) {
        const hmac = crypto.createHmac('sha256', 'secret');
        password = hmac.update(password).digest('hex');
    }

    try {
        var conn = await database.getConnection();
        let query = 'INSERT INTO user SET ?';
        let user = { ID: email, PW: password };
        await conn.query(query, user);
        req.session.user = user;
        res.redirect('/');
    }
    catch (error) {
        console.log('error:', error);
        res.redirect('/signup');
    }
    finally {
        await database.releaseConnection(conn);
    }
});

module.exports = router;