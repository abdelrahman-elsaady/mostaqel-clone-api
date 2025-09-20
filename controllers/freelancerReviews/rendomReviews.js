const mongoose = require('mongoose');
const User = require('../../models/users');
const Project = require('../../models/project');
const Review = require('../../models/reviews');

// Function to generate a random number between min and max (inclusive)
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// Function to generate random review data
const generateRandomReview = async () => {
  try {
    // Fetch random freelancer and client
    const freelancer = await User.aggregate([{ $match: { role: 'freelancer' } }, { $sample: { size: 1 } }]);
    const client = await User.aggregate([{ $match: { role: 'client' } }, { $sample: { size: 1 } }]);
    const project = await Project.aggregate([{ $sample: { size: 1 } }]);

    if (!freelancer.length || !client.length || !project.length) {
      throw new Error('Unable to find users or projects. Make sure you have freelancers, clients, and projects in your database.');
    }

    const review = {
     
        freelancer: new mongoose.Types.ObjectId(freelancer[0]._id),
        client: new mongoose.Types.ObjectId(client[0]._id),
        project: new mongoose.Types.ObjectId(project[0]._id),
      comment: `Random review comment ${Math.random().toString(36).substring(7)}`,
      professionalism: randomNumber(1, 5),
      communication: randomNumber(1, 5),
      qualityOfWork: randomNumber(1, 5),
      expertise: randomNumber(1, 5),
      onTimeDelivery: randomNumber(1, 5),
      wouldHireAgain: randomNumber(1, 5)
    };

    return review;
  } catch (error) {
    console.error('Error generating random review:', error);
    return null;
  }
};

module.exports = generateRandomReview;