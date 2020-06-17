const localstrategy = require('passport-local').Strategy;

function passportAuthenticator(passport, user) {
    passport.use(new localstrategy({ usernameField: 'email' }, (email, password, done) => {
        user.findOne({ email: email }, (err, data) => {
            if (err) return done(err);
            if (!data) {
                console.log('user not found');
                return done(null, false, { message: 'No user with that email' });
            }
            else {
                if (data.password == password) {
                    return done(null, data);
                }
                else
                    return done(null, false, { message: 'Password incorrect' });

            }
        });
    }));
    passport.serializeUser((data, done) => done(null, data.id));
    passport.deserializeUser((id, done) => {
        user.findById(id, (err, data) => {
            done(null, data);
        });
    });
}
module.exports = passportAuthenticator;