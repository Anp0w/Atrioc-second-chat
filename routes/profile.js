// routes/profile.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

router.get('/', ensureAuthenticated, async (req, res) => {
  const { TWITCH_CLIENT_ID, BROADCASTER_ID } = process.env;
  let followStatus = false;

  // Check if the user is following Atrioc.
  try {
    const followResponse = await axios.get(
      `https://api.twitch.tv/helix/users/follows?from_id=${req.user.id}&to_id=${BROADCASTER_ID}`,
      {
        headers: {
          'Client-ID': TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${req.user.accessToken}`
        }
      }
    );
    followStatus = followResponse.data.total > 0;
  } catch (error) {
    console.error('Error checking follow status:', error.response ? error.response.data : error.message);
  }

  // Skip subscription check entirely.
  const subscriptionStatus = false;

  let html = `<h1>${req.user.displayName}'s Profile</h1>
              <p><strong>Following Atrioc:</strong> ${followStatus ? 'Yes' : 'No'}</p>
              <p><strong>Subscribed to Atrioc:</strong> No</p>`;

  // Since we're not checking subscriptions, display only regular emotes.
  html += `
      <h2>Regular Emotes</h2>
      <img src="https://static-cdn.jtvnw.net/emoticons/v2/RegularEmote1/default/dark/1.0" alt="Regular Emote 1">
      <img src="https://static-cdn.jtvnw.net/emoticons/v2/RegularEmote2/default/dark/1.0" alt="Regular Emote 2">
  `;
  html += `<p><a href="/">Back to Home</a></p>`;
  res.send(html);
});

module.exports = router;