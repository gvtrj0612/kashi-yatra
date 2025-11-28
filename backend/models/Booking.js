const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  package: {
    type: mongoose.Schema.ObjectId,
    ref: 'Package',
    required: true
  },
  travelers: [{
    name: {
      type: String,
      required: true
    },
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    idProof: {
      type: String,
      enum: ['aadhar', 'passport', 'driving_license', 'voter_id']
    },
    idNumber: String
  }],
  tripDetails: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    duration: {
      type: Number,
      required: true
    }
  },
  contactInfo: {
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    }
  },
  pricing: {
    packagePrice: {
      type: Number,
      required: true
    },
    extraCharges: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    finalAmount: {
      type: Number,
      required: true
    }
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'upi', 'netbanking', 'wallet']
    },
    transactionId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled', 'completed'],
    default: 'pending'
  },
  specialRequests: String,
  assignedGuide: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  cancellation: {
    isCancelled: {
      type: Boolean,
      default: false
    },
    cancelledAt: Date,
    reason: String,
    refundAmount: Number
  },
  reviews: [{
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Generate booking ID before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingId = `KY${Date.now()}${count + 1}`;
  }
  next();
});

// Calculate end date based on start date and duration
bookingSchema.pre('save', function(next) {
  if (this.tripDetails.startDate && this.tripDetails.duration && !this.tripDetails.endDate) {
    const endDate = new Date(this.tripDetails.startDate);
    endDate.setDate(endDate.getDate() + this.tripDetails.duration);
    this.tripDetails.endDate = endDate;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);