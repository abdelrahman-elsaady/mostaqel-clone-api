const Review = require('../../models/reviews');
const generateRandomReview = require('./rendomReviews');

exports.createRandomReview = async (req, res) => {
  try {
    const randomReviewData = await generateRandomReview();
    
    if (!randomReviewData) {
      return res.status(400).json({ message: 'Unable to generate random review data' });
    }
// console.log(randomReviewData);
    const newReview = new Review(randomReviewData);
    console.log(newReview);
    await newReview.save();

    res.status(201).json({
      message: 'Random review created successfully',
      review: newReview
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating random review', error: error.message });
  }
};