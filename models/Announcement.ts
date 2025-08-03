import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['General', 'Tournament', 'Maintenance', 'Feature', 'Emergency'],
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  target: {
    type: String,
    enum: ['All Users', 'Registered Users', 'Premium Users', 'Specific Users', 'Teams'],
    default: 'All Users'
  },
  targetUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  targetTeams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  scheduling: {
    publishAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: Date,
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  display: {
    showOnHomepage: {
      type: Boolean,
      default: true
    },
    showInNavbar: {
      type: Boolean,
      default: false
    },
    showAsPopup: {
      type: Boolean,
      default: false
    },
    popupDismissible: {
      type: Boolean,
      default: true
    },
    backgroundColor: String,
    textColor: String,
    icon: String
  },
  media: {
    images: [String],
    videos: [String],
    attachments: [{
      name: String,
      url: String,
      size: Number,
      type: String
    }]
  },
  interaction: {
    allowComments: {
      type: Boolean,
      default: false
    },
    allowReactions: {
      type: Boolean,
      default: true
    },
    requireAcknowledgment: {
      type: Boolean,
      default: false
    }
  },
  statistics: {
    views: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    reactions: [{
      type: {
        type: String,
        enum: ['like', 'love', 'helpful', 'important']
      },
      count: {
        type: Number,
        default: 0
      }
    }],
    comments: {
      type: Number,
      default: 0
    },
    acknowledgments: {
      type: Number,
      default: 0
    }
  },
  userInteractions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewed: {
      type: Boolean,
      default: false
    },
    viewedAt: Date,
    acknowledged: {
      type: Boolean,
      default: false
    },
    acknowledgedAt: Date,
    reaction: {
      type: String,
      enum: ['like', 'love', 'helpful', 'important']
    }
  }],
  status: {
    type: String,
    enum: ['Draft', 'Scheduled', 'Published', 'Archived'],
    default: 'Draft'
  },
  isSticky: {
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

announcementSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);
