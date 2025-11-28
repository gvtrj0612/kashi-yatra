const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true,
    maxlength: [100, 'Package name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Package description is required']
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  price: {
    type: Number,
    required: [true, 'Package price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  duration: {
    days: {
      type: Number,
      required: true,
      min: 1
    },
    nights: {
      type: Number,
      default: 0
    }
  },
  categories: [{
    type: String,
    enum: ['spiritual', 'cultural', 'budget', 'premium', 'family', 'adventure', 'luxury'],
    required: true
  }],
  inclusions: [{
    type: String,
    required: true
  }],
  exclusions: [{
    type: String
  }],
  itinerary: [{
    day: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    activities: [String],
    meals: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'all', 'none']
    }
  }],
  images: [{
    url: String,
    alt: String,
    caption: String
  }],
  highlights: [String],
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'difficult'],
    default: 'easy'
  },
  maxTravelers: {
    type: Number,
    default: 10
  },
  availableDates: [Date],
  isActive: {
    type: Boolean,
    default: true
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
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for search functionality
packageSchema.index({
  name: 'text',
  description: 'text',
  highlights: 'text'
});

// Virtual for discount percentage
packageSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

module.exports = mongoose.model('Package', packageSchema);