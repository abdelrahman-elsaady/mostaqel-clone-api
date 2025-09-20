const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getUserPortfolios, createPortfolio } = require('../controllers/portfolio');
let {auth,restrictTo}=require('../middlewares/authorization')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './static/users')
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
});
const upload = multer({ storage: storage });

router.get('/freelancer/:id', getUserPortfolios);
router.post('/', auth, upload.single('image'), createPortfolio);

module.exports = router;
