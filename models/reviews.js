const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    rating: { type: Number,  min: 1, max: 5 },
    comment: { type: String, },
    professionalism: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    qualityOfWork: { type: Number, min: 1, max: 5 },
    expertise: { type: Number, min: 1, max: 5 },
    onTimeDelivery: { type: Number, min: 1, max: 5 },
    wouldHireAgain: { type: Number, min: 1, max: 5 }
  }, { timestamps: true });



  reviewSchema.pre('save', async function(next) {
    const avgRating = (
      this.professionalism +
      this.communication +
      this.qualityOfWork +
      this.expertise +
      this.onTimeDelivery +
      this.wouldHireAgain
    ) / 6;
    
    this.rating = Math.round(avgRating * 10) / 10; // Round to 1 decimal place
    next();
  });
  
  // Update user's average rating after saving a review
  reviewSchema.post('save', async function() {
    const User = mongoose.model('user');
    const freelancer = await User.findById(this.freelancer);
    
    if (!freelancer) {
      console.error('Freelancer not found');
      return;
    }
  
    if (!freelancer.reviews) {
      freelancer.reviews = [];
    }
  
    freelancer.reviews.push(this._id);
  
    const reviews = await this.constructor.find({ freelancer: this.freelancer });
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => {
        return sum + (review.rating || 0);
      }, 0);
      freelancer.averageRating = Math.round((totalRating / reviews.length) * 10) / 10;
    } else {
      freelancer.averageRating = 0;
    }
  
    await freelancer.save();
  });



const reviwModel= mongoose.model('Review', reviewSchema);

module.exports = reviwModel