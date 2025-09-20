



const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, { timestamps: true });



// portfolioSchema.post('save', async function(doc) {
  
//   const User = mongoose.model('user');
//   const freelancer = await User.findById(this.freelancerId);
  
//   freelancer.portfolio.push(this._id);
  
//   // const reviews = await this.constructor.find({ freelancer: this.freelancer });
//   // const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//   // freelancer.averageRating = Math.round((totalRating / reviews.length) * 10) / 10;
  
//   await freelancer.save();



// });







const Portfolio = mongoose.model('Portfolio', portfolioSchema);




module.exports = Portfolio;