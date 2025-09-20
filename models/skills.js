const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // unique: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    // required: true
  },
  
}, { timestamps: true });

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;