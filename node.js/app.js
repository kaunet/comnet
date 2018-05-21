const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
//const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');

/*post*/

const post = require('./routes/post');

/*post*/

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(session({
	secret: 'kDF2AC8C42BD555B6BE1F2BBBDE4BFF614E60F0F6A3AC12EAEDB163077BFD428C',
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 3600 * 30,
		httpOnly: true
	}
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/users', users);

/*post*/

app.use('/post', post); //app에 등록합니다 / post 로 요청이 왔을때 처리

/*post*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
