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

			for (let i = 2; i < 32; i++) {
				let new_post = Object.assign({}, posts[0]);
				new_post.Time = moment().format('YYYY-MM-DD HH:mm:ss');
				new_post.PostID = i;
				posts.push(new_post);
			}

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
		print('error:', error);
		res.redirect('/');
	}
});

module.exports = router;