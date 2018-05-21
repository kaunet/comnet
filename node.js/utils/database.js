// const mysql = require('mysql');
const mysqlPromise = require('promise-mysql');
const mysqlPromiseConfiguration = require('./dbconfig');

module.exports = mysqlPromise.createPool(mysqlPromiseConfiguration);