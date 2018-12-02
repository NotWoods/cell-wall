import passport = require("passport");
import { OAuth2Strategy } from "passport-google-oauth";

const { GOOGLE_PHOTOS_CLIENT_ID, GOOGLE_PHOTOS_CLIENT_SECRET } = process.env;

if (!GOOGLE_PHOTOS_CLIENT_ID || !GOOGLE_PHOTOS_CLIENT_SECRET) {
  throw new Error("Missing Google Photos API keys");
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
passport.use(
  new OAuth2Strategy(
    {
      clientID: GOOGLE_PHOTOS_CLIENT_ID,
      clientSecret: GOOGLE_PHOTOS_CLIENT_SECRET,
      callbackURL: "https://photoslibrary.googleapis.com"
    },
    (token, refreshToken, profile, done) => done(null, { profile, token })
  )
);
