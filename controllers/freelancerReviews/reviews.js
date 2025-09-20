


const User = require('../../models/users');
const Review = require('../../models/reviews');



exports.getFreelancerReviews = async (req, res) => {
  try {
    const freelancerId = req.params.id;
    const freelancer = await User.findById(freelancerId).populate({
      path: 'reviews',
      populate: {
        path: 'client project freelancer',
        select: 'firstName lastName profilePicture title rating averageRating country createdAt'
      }
    });

    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    const reviews = freelancer.reviews;
    const averageRating = freelancer.averageRating;

    const ratingBreakdown = {
      professionalism: 0,
      communication: 0,
      qualityOfWork: 0,
      expertise: 0,
      onTimeDelivery: 0,
      wouldHireAgain: 0
    };

    reviews.forEach(review => {
      ratingBreakdown.professionalism += review.professionalism;
      ratingBreakdown.communication += review.communication;
      ratingBreakdown.qualityOfWork += review.qualityOfWork;
      ratingBreakdown.expertise += review.expertise;
      ratingBreakdown.onTimeDelivery += review.onTimeDelivery;
      ratingBreakdown.wouldHireAgain += review.wouldHireAgain;
    });

    for (let key in ratingBreakdown) {
      ratingBreakdown[key] = Math.round((ratingBreakdown[key] / reviews.length) * 10) / 10;
    }

    res.json({
      averageRating,
      ratingBreakdown,
      reviews,
      freelancer
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching freelancer reviews', error: error.message });
  }
  
};