const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const moment = require('moment');

const database = require('../utils/database');


router.get('/', (req, res) => res.render('login', { year: moment().format('YYYY') }));

router.post('/', async (req, res) => {

    let { email, password } = req.body;

    // 1 sec
    for (let i = 0; i < 100; i++) {
        const hmac = crypto.createHmac('sha256', 'secret');
        password = hmac.update(password).digest('hex');
    }

    try {
        var conn = await database.getConnection();
        let query = 'SELECT * FROM user WHERE ID = ? AND PW = ?';
        let user = (await conn.query(query, [email, password]))[0];
        if (!user) {
            res.redirect('/login');
        } else {
            req.session.user = user;
            res.redirect('/');
        }
    }
    catch (error) {
        console.log('error:', error);
        res.redirect('/login');
    }
    finally {
        await database.releaseConnection(conn);
    }
});

module.exports = router;