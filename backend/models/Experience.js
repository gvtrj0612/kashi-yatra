const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Experience name is required'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 150
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['hours', 'days'],
      default: 'hours'
    }
  },
  category: {
    type: String,
    enum: ['cultural', 'spiritual', 'adventure', 'culinary', 'shopping', 'photography'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  meetingPoint: String,
  includes: [String],
  requirements: [String],
  images: [{
    url: String,
    alt: String
  }],
  maxParticipants: {
    type: Number,
    default: 10
  },
  availableSlots: [{
    date: Date,
    startTime: String,
    endTime: String,
    availableSpots: Number
  }],
  guide: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  highlights: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Experience', experienceSchema);