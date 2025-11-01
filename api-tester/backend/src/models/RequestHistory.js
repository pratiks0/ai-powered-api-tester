import mongoose from 'mongoose';

const requestHistorySchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    uppercase: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  headers: {
    type: Map,
    of: String,
    default: new Map()
  },
  body: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  response: {
    status: Number,
    headers: {
      type: Map,
      of: String
    },
    data: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7 * 24 * 60 * 60 // Automatically delete after 7 days
  }
});

// Index for efficient retrieval of recent requests
requestHistorySchema.index({ createdAt: -1 });

const RequestHistory = mongoose.model('RequestHistory', requestHistorySchema);

export default RequestHistory;