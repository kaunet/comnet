const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const moment = require('moment');

const database = require('../utils/database');


router.get('/', function(req, res) {
    res.render('login', { message: '', year: moment().format('YYYY'), from: req.query.from || '/' })
});

router.post('/', async (req, res) => {

    let { email, password } = req.body;
    let from = req.query.from || '/';

    // 1 sec
    for (let i = 0; i < 100; i++) {
        const hmac = crypto.createHmac('sha256', 'secret');
        password = hmac.update(password).digest('hex');
    }

    try {
        var conn = await database.getConnection();
        await conn.beginTransaction();
        try {
            let preQuery = 'SELECT * FROM user WHERE ID = ? AND PW = ?';
            let user = (await conn.query(preQuery, [email, password]))[0];
            if (!user) {
                let query = 'SELECT * FROM user WHERE ID = ?';
                user = (await conn.query(query, email))[0];
            }
            await conn.commit();
            if (!user || user.PW != password) {
                res.render('login', { message: '아이디 혹은 비밀번호가 틀렸습니다.', from: from });
            } else {
                req.session.user = user;
                res.redirect(from);
            }
        }
        catch (error) {
            throw error;
        }
    }
    catch (error) {
        await conn.rollback();
        console.error(error);
        res.redirect(`/login?from=${from}`);
    }
    finally {
        await database.releaseConnection(conn);
    }
});

module.exports = router;