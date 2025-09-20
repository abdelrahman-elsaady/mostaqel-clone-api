const express = require('express')
let router = express.Router()
let {auth,restrictTo}=require('../middlewares/authorization')
let {showReviews , saveReviews,deleteReviews,updatereviewsById,getUserReviews} = require('../controllers/reviews')
let {getFreelancerReviews}=require('../controllers/freelancerReviews/reviews')
let {createRandomReview}=require('../controllers/freelancerReviews/GinRandomRev')

router.get('/freelancer/:id', getFreelancerReviews);
router.get('/' , showReviews)
router.post('/', auth, saveReviews);
router.delete('/:id', auth, deleteReviews);
router.patch('/:id', auth, updatereviewsById);
router.get('/:userId', getUserReviews);
router.post('/random', auth, restrictTo('admin'), createRandomReview);

module.exports=router
