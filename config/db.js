// config/db.js
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/atrioc-chat';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB:', mongoURI);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});