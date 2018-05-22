const express = require('express');
const router = express.Router();

const database = require('../utils/database');

const moment = require('moment');

router.get('/', async function(req, res, next) {

	let user = req.session.user;
	console.log('user:', user);

	try {
		var conn = await database.getConnection();
		try {
			let query = 'SELECT * FROM user';
			console.log('query:', query);
			let users = await conn.query(query);
			console.log('users:', users);

			let recent_posts = [];
			for (let i = 0; i < 10; i++) {
				recent_posts.push({
					id: 10-i,
					title: "Computer network so ambiguous!",
					author: "rapsealk",
					status: "completed",
					timestamp: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
				});
			}

			res.render('index', { user: user, posts: recent_posts, update: moment().format('YYYY-MM-DD HH:mm:ss') });
		}
		catch (error) {
			throw error;
		}
		finally {
			await database.releaseConnection(conn);
		}
	}
	catch (error) {
		console.log('error:', error);
		res.redirect('/');
	}
});

module.exports = router;