const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
//const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const post = require('./routes/post');

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
		maxAge: 60 * 30 * 1000,
		httpOnly: true
	}, rolling: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	res.setTimeout(30 * 1000, function() {	// 6s
		res.status(408).end('Request Timeout');
	});
	next();
});

app.use('/', index);
app.use('/signup', require('./routes/signup'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/post', post); //app에 등록합니다 / post 로 요청이 왔을때 처리

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