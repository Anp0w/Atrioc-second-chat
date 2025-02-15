// config/passport.js
console.log(process.env.TWITCH_CLIENT_ID);
const TwitchStrategy = require('passport-twitch-new').Strategy;

require('dotenv').config(); // Load env variables

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new TwitchStrategy({
  clientID: process.env.TWITCH_CLIENT_ID,
  clientSecret: process.env.TWITCH_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  scope: ['user:read:email', 'user:read:follows']
}, (accessToken, refreshToken, profile, done) => {
  // Attach the access token to the profile for later API calls.
  profile.accessToken = accessToken;
  process.nextTick(() => done(null, profile));
}));