const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const authConfig = require('../data/google-config');
const Users = require('./users.model');
const Constants = require('./constants');
const CheckUserWare = require('./middlewares/check-user');

passport.use(new GoogleStrategy({
    clientID: authConfig.CLIENT_ID,
    clientSecret: authConfig.CLIENT_SECRET,
    callbackURL: authConfig.CALLBACK_URL
}, (accessToken,refreshToken,profile,done) => {
    Users.findOne({"googleId" : profile.id}).then((user) => {
        if(!user) { 
            const userData = new Users({
                username: profile.displayName.toLowerCase().trim(),
                email: profile._json.email.toLowerCase().trim(),
                password: '',
                address: '',
                phone: '',
                profileImage: profile._json.picture,
                dob: '',
                createdAt: new Date().getTime()
            })
            userData.save()
                .then((result) => {
                    if (!result) {
                        return callback(Constants.COMMON_ERROR_MESSAGE);
                    }
                    const data = { email: result.email, userId: result._id, username: result.username };
                    const token = CheckUserWare.generateToken(data);
                    console.log(token);
                    // localStorage.setItem('currentUser', JSON.stringify(token));
                    // this.isAuthenticated = true;
                    // this.authStatus.next(true);
                    // this.router.navigate(['../dashboard']);
                    // window.location.href = 'http://localhost:4200/dashboard';
                    // return callback(null, { token: token });
                })
                .catch((err) => {
                    console.log(err);
                    return callback(Constants.COMMON_ERROR_MESSAGE);
                })
        } else {

        }
    })
    
}));
