const express = require('express');
const router = express.Router();

const database = require('../utils/database');

const moment = require('moment');

router.get('/', async function(req, res, next) {

	let user = req.session.user;
	console.log('user:', user);

	try {
		var conn = await database.getConnection();
		await conn.beginTransaction();
		try {
			let query = 'SELECT * FROM post ORDER BY Time DESC';
			let posts = await conn.query(query);

			let parallel = posts.map(async (post, index) => {
				post.time = moment(post.time).format('YYYY-MM-DD HH:mm:ss');
				let _query = 'SELECT * FROM comment WHERE PostID = ?';
				posts[index].comments = (await conn.query(_query, post.PostID)).length;
			});
			await Promise.all(parallel);

			res.render('index', { user: user, posts: posts, timestamp: moment().format('YYYY-MM-DD HH:mm:ss') });
		}
		catch (error) {
			throw error;
		}
	}
	catch (error) {
		await conn.rollback();
		console.error(error);
		res.redirect('/');
	}
	finally {
		await database.releaseConnection(conn);
	}
});

module.exports = router;