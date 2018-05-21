const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {

    if (req.session.user) {
        await req.session.destroy();
    }
    res.redirect('/');
});

module.exports = router;