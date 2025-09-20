const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const usersSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  jobtitle: {
    type: String,
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  profileName: {
    type: String,
    trim: true,
    maxlength: [50, 'Profile name cannot exceed 50 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    default: "67057b9b9c7a9f52039a0242"
  },
  profilePicture: {
    type: String,
    default: 'https://i.ibb.co/MG513bH/Default-user.png',
    validate: {
      validator: function(v) {
        return !v || validator.isURL(v, { protocols: ['http', 'https'] });
      },
      message: 'Profile picture must be a valid URL'
    }
  },
  profilePicturePublicId: {
    type: String,
    default: null
  },
  bio: { 
    type: String, 
    trim: true,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  skills: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Skill' 
  }],
  role: {
    type: String,
    enum: {
      values: ['client', 'freelancer'],
      message: 'Role must be either client or freelancer'
    },
    required: [true, 'Role is required']
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  averageRating: { 
    type: Number, 
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other', ''],
      message: 'Gender must be male, female, other, or empty'
    }
  },
  projectCompletionRate: {
    type: Number,
    default: 0,
    min: [0, 'Completion rate cannot be negative'],
    max: [100, 'Completion rate cannot exceed 100']
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v < new Date();
      },
      message: 'Date of birth must be in the past'
    }
  },
  onTimeDeliveryRate: {
    type: Number,
    default: 0,
    min: [0, 'Delivery rate cannot be negative'],
    max: [100, 'Delivery rate cannot exceed 100']
  },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'message'
  }],
  availableBalance: {
    type: Number,
    default: 0,
    min: [0, 'Available balance cannot be negative']
  },
  pendingBalance: {
    type: Number,
    default: 0,
    min: [0, 'Pending balance cannot be negative']
  },
  totalBalance: {
    type: Number,
    default: 0,
    min: [0, 'Total balance cannot be negative']
  },
  withdrawableBalance: {
    type: Number,
    default: 0,
    min: [0, 'Withdrawable balance cannot be negative']
  },
  averageResponseTime: {
    type: Number,
    default: 0,
    min: [0, 'Response time cannot be negative']
  },
  completedProjects: {
    type: Number,
    default: 0,
    min: [0, 'Completed projects cannot be negative']
  },
  portfolio: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio'
  }],
  languages: {
    type: String, 
    trim: true,
    maxlength: [200, 'Languages cannot exceed 200 characters']
  },
  hourlyRate: {
    type: Number,
    min: [0, 'Hourly rate cannot be negative'],
    max: [10000, 'Hourly rate cannot exceed $10,000']
  },
  statistics: {
    completionRate: { 
      type: Number, 
      default: 0,
      min: [0, 'Completion rate cannot be negative'],
      max: [100, 'Completion rate cannot exceed 100']
    },
    onTimeDeliveryRate: { 
      type: Number, 
      default: 0,
      min: [0, 'Delivery rate cannot be negative'],
      max: [100, 'Delivery rate cannot exceed 100']
    },
    averageResponseTime: { 
      type: Number, 
      default: 0,
      min: [0, 'Response time cannot be negative']
    },
    totalProjects: { 
      type: Number, 
      default: 0,
      min: [0, 'Total projects cannot be negative']
    },
    totalEarnings: { 
      type: Number, 
      default: 0,
      min: [0, 'Total earnings cannot be negative']
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  country: {
    type: String,
    maxlength: [100, 'Country name cannot exceed 100 characters']
  },
  proposals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'proposals'
  }],
  joinDate: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

usersSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

usersSchema.pre('save', async function(next) {
  if (!this.password || !this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

usersSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model('user', usersSchema);
module.exports = userModel;