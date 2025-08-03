import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Banner', 'Sidebar', 'Popup', 'Native', 'Video', 'Sponsored Content'],
    required: true
  },
  format: {
    type: String,
    enum: ['Image', 'Video', 'HTML', 'Text'],
    required: true
  },
  content: {
    imageUrl: String,
    videoUrl: String,
    htmlContent: String,
    textContent: String,
    clickUrl: String,
    altText: String
  },
  dimensions: {
    width: Number,
    height: Number,
    aspectRatio: String
  },
  targeting: {
    countries: [String],
    languages: [String],
    userTypes: [{
      type: String,
      enum: ['Guest', 'Registered', 'Premium', 'All']
    }],
    skillLevels: [{
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    }],
    interests: [String],
    ageRange: {
      min: Number,
      max: Number
    },
    devices: [{
      type: String,
      enum: ['Desktop', 'Mobile', 'Tablet']
    }]
  },
  placement: {
    pages: [{
      type: String,
      enum: ['Home', 'Battle', 'Practice', 'Tournaments', 'Profile', 'Teams', 'Leaderboard', 'All']
    }],
    position: {
      type: String,
      enum: ['Header', 'Footer', 'Sidebar', 'Content', 'Overlay', 'Interstitial']
    },
    priority: {
      type: Number,
      default: 1,
      min: 1,
      max: 10
    }
  },
  scheduling: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    daysOfWeek: [{
      type: Number,
      min: 0,
      max: 6
    }],
    hoursOfDay: [{
      start: Number,
      end: Number
    }]
  },
  budget: {
    type: {
      type: String,
      enum: ['CPM', 'CPC', 'CPA', 'Fixed'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    dailyLimit: Number,
    totalBudget: Number,
    spent: {
      type: Number,
      default: 0
    }
  },
  performance: {
    impressions: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    conversions: {
      type: Number,
      default: 0
    },
    ctr: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    },
    revenue: {
      type: Number,
      default: 0
    }
  },
  advertiser: {
    name: {
      type: String,
      required: true
    },
    email: String,
    website: String,
    contactPerson: String,
    logoUrl: String
  },
  approval: {
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Needs Review'],
      default: 'Pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date,
    reviewComments: String
  },
  status: {
    type: String,
    enum: ['Draft', 'Scheduled', 'Active', 'Paused', 'Completed', 'Cancelled'],
    default: 'Draft'
  },
  isActive: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

advertisementSchema.pre('save', function() {
  this.updatedAt = new Date();
  
  // Calculate CTR
  if (this.performance && this.performance.impressions > 0) {
    this.performance.ctr = (this.performance.clicks / this.performance.impressions) * 100;
  }
  
  // Calculate conversion rate
  if (this.performance && this.performance.clicks > 0) {
    this.performance.conversionRate = (this.performance.conversions / this.performance.clicks) * 100;
  }
});

export const Advertisement = mongoose.models.Advertisement || mongoose.model('Advertisement', advertisementSchema);
