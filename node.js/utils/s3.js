const AWS = require('aws-sdk');
switch (process.platform) {
	case 'win32':
	case 'darwin':
	case 'linux':
        AWS.config.loadFromPath('./utils/credentials.json');
        break;
}
const s3 = new AWS.S3();
const multer = require('multer');
const multerS3 = require('multer-s3');
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'kaunet',
        acl: 'public-read-write',
        key: function(req, file, callback) {
            console.log('file.originalname:', file.originalname);
            callback(null, Date.now() + '.' + file.originalname.split('.').pop());
        }
    })
});
exports.upload = upload;
exports.s3 = s3;