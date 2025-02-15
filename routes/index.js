// routes/index.js
const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  let html = `<h1>Welcome to Atrioc's Second Stream Chat</h1>
              <p><a href="/chat">Enter Chat</a></p>`;
  if (req.isAuthenticated()) {
    html += `<p>Logged in as: ${req.user.displayName} - <a href="/profile">View Profile</a></p>
             <p><a href="/auth/logout">Logout</a></p>`;
  } else {
    html += `<p><a href="/auth/twitch">Login with Twitch</a></p>`;
  }
  res.send(html);
});

router.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;