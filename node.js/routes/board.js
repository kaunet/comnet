import express from 'express';
//const { express } = require('express');
// const express = require('express');
const router = express.Router();

const database = require('../utils/database');

const moment = require('moment');

/* GET board page. */
router.get('/', async function(req, res, next) {

    let page = req.query.page;
    if (!page) return res.redirect('/board?page=1');

    try {
        var conn = await database.getConnection();
        try {
            // let query = 'SELECT idx, title, writer, hit, DATE_FORMAT(moddate, "%Y/%m/%d %T) AS moddate FROM Board';
            // let posts = await conn.query(query);
            res.render('board', { });
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
