const mongoose = require('mongoose');


const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  uploadId: String,         
  assetId: String,        
  playbackId: String,      
  status: {
    type: String,
    default: 'waiting',     
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Video', videoSchema);
