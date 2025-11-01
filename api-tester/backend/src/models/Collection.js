import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE']
  },
  url: {
    type: String,
    required: true
  },
  headers: {
    type: Map,
    of: String
  },
  body: {
    type: mongoose.Schema.Types.Mixed
  },
  description: String
});

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  requests: [requestSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
collectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;