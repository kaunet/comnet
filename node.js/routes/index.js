const express = require('express');
const router = express.Router();

const database = require('../utils/database');

const moment = require('moment');

/* GET home page. */
router.get('/', async function(req, res, next) {

	let user = req.session.user;
	console.log('user:', user);

	try {
		var conn = await database.getConnection();
		try {
			let query = 'SELECT * FROM post ORDER BY Time DESC';
			let posts = await conn.query(query);

			let parallel = posts.map(post => {
				post.Time = moment(post.Time).format('YYYY-MM-DD HH:mm:ss');
			});
			await Promise.all(parallel);

			res.render('index', { user: user, posts: posts, timestamp: moment().format('YYYY-MM-DD HH:mm:ss') });
		}
		catch (error) {
			throw error;
		}
		finally {
			await database.releaseConnection(conn);
		}
	}
	catch (error) {
		console.error(error);
		res.redirect('/');
	}
});

module.exports = router;