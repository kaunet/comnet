const epxress = require('express');
const router = express.Router();

router.get('/', async function(req, res) {

    res.redirect('/');
});

module.exports = router;