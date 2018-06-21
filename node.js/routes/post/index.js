const express = require('express');
const router = express.Router();

const database = require('../../utils/database');
const multer = require('../../utils/s3').upload;
const moment = require('moment');

router.use('/new', require('./new'));

router.get('/:id', async function(req, res) {

	let id = req.params.id;
	if (!id) return res.redirect('/');

	let user = req.session.user;
	if (!user) return res.redirect(`/login?from=/post/${id}`);

	let passwordEncoded = parseInt(req.query.encoded) || 0;
	if (req.query.password && !passwordEncoded) {
		return res.redirect(`/post/${id}?password=${encodeURIComponent(req.query.password)}&encoded=1`);
	}

	console.log('password:', req.query.password);

	try {
		var conn = await database.getConnection();
		await conn.beginTransaction();
		try {
			let query1 = 'SELECT * FROM post WHERE PostID = ?';
			let post = (await conn.query(query1, id)).shift();
			
			if (post) {

				// password
				if (post.password) {
					if (post.password != req.query.password) {
						await conn.commit();
						// await database.releaseConnection(conn);
						return res.render('post/auth', { id: id });
					}
				}

				let query2 = 'SELECT * FROM comment WHERE PostID = ?';
				post.comments = await conn.query(query2, post.PostID);
				let parallel = post.comments.map(comment => {
					comment.TimeStamp = moment(comment.TimeStamp).format('YYYY-MM-DD HH:mm:ss');
				});
				await Promise.all(parallel);
				let query3 = 'SELECT * FROM file WHERE PostID = ?';
				post.file = (await conn.query(query3, id)).shift();
				console.log('post.file:', post.file);
				await conn.commit();
				res.render('post', { user: user, post: post, timestamp: moment().format('YYYY-MM-DD HH:mm:ss') });
			} else {
				await conn.destroy();
				res.redirect('/');
			}
		}
		catch (error) {
			throw error;
		}
	}
	catch (error) {
		await conn.rollback();
		console.log('error:', error);
		res.redirect('/');
	}
	finally {
		await database.releaseConnection(conn);
	}
});

/*
router.post('/file', multer.single('file'), function(req, res) {
	console.log('req.file:', req.file);
	res.json({ succeed: true, url: req.file.location });
});
*/

router.delete('/:id/comment', async function(req, res) {

	let user = req.session.user;

	let id = req.params.id;
	let commentId = req.body.commentId;
	console.log('commentId:', commentId);
	
	try {
		var conn = await database.getConnection();
		let query = 'DELETE FROM comment WHERE CommentId = ?';
		let result = await conn.query(query, commentId);
		console.log('result:', result);
		res.json({ succeed: true, commentId: commentId });
	}
	catch (error) {
		console.error(error);
		res.json({ succeed: false });
	}
	finally {
		await database.releaseConnection(conn);
	}
});

router.post('/:id/comment', async function(req, res){
	
	let user = req.session.user;
	let id = req.params.id;
	
	let body = req.body.comment;

	console.log('body:',body);

	try {
		var conn = await database.getConnection();
		await conn.beginTransaction();
		try {
			let query1 = 'SELECT * FROM post WHERE PostID = ?';
			let post = (await conn.query(query1, id)).shift();

			let timestamp = new Date();

			let query = 'INSERT INTO comment SET ?';
			let comment = {
				TimeStamp: timestamp,
				PostID: post.PostID, 
				ID: user.ID,
				body: body
			};

			let result = await conn.query(query, comment);
			console.log('result:',result);

			let query2 = 'SELECT * FROM comment ORDER BY CommentID DESC';
			let _comment = (await conn.query(query2, timestamp)).shift();
			_comment.TimeStamp = moment(_comment.TimeStamp).format('YYYY-MM-DD HH:mm:ss');

			await conn.commit();
			res.json({ succeed: true, comment: _comment });
		}
		catch (error) {
			throw error;
		}  
	} catch (error){
		await conn.rollback();
		console.error(error);
		res.json({ succeed: false });
	}
	finally{
		await database.releaseConnection(conn);
	}
});

module.exports = router;