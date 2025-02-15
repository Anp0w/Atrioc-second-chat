// server.js
require('dotenv').config(); // Load environment variables

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Import DB and Passport configuration
require('./config/db'); // Connect to MongoDB
require('./config/passport'); // Set up Twitch OAuth strategy

// Configure sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport and sessions
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Use our route files
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));

// Import ChatMessage model for storing chat data
const ChatMessage = require('./models/chatmessage');

// Socket.IO: Real‑time Chat handling
io.on('connection', (socket) => {
  console.log('A user connected to chat');

  // When a chat message is received...
  socket.on('chat message', async (data) => {
    // data is expected to be an object: { username, message }
    const { username, message } = data;
    const chatMessage = new ChatMessage({
      username: username || 'Anonymous',
      message,
      timestamp: new Date()
    });
    try {
      await chatMessage.save();
      // Broadcast the saved chat message (including timestamp) to all clients
      io.emit('chat message', chatMessage);
    } catch (err) {
      console.error('Error saving chat message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from chat');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});