const mysqlPromise = require('promise-mysql');
const mysqlPromiseConfiguration = require('./dbconfig.json');

module.exports = mysqlPromise.createPool(mysqlPromiseConfiguration);