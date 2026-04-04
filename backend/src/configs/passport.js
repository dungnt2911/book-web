const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;

        // Tìm theo googleId trước
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            
            user = await User.findOne({ email });

            if (user) {
                
                user.googleId = profile.id;
                await user.save();
            } else {
                // Tạo mới hoàn toàn
                user = await User.create({
                    googleId: profile.id,
                    email,
                    username: email,
                    avatar: profile.photos[0]?.value || '',
                    password: null,
                    role: 'user' 
                });
            }
        }

        if (user.status === 'blocked') {
            return done(null, false, { message: 'Tài khoản bị khóa' });
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;