const passport = require("passport");
const GithubStrategy = require("passport-github2");
const userModel = require("../dao/models/user.model");
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = require("./config");

const GITHUB_CLIENT_ID_CONFIG = `${GITHUB_CLIENT_ID}`;
const GITHUB_CLIENT_SECRET_CONFIG = `${GITHUB_CLIENT_SECRET}`;

const initializePassport = () => {
    passport.use(
        "github",
        new GithubStrategy(
            {
                clientID: GITHUB_CLIENT_ID_CONFIG,
                clientSecret: GITHUB_CLIENT_SECRET_CONFIG,
                callbackURL: "http://localhost:8080/api/session/github/callback", 
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log("PROFILE GITHUB INFO ******", profile);
                    let email = profile._json?.email || `${profile._json?.login}@gmail.com`
                    let user = await userModel.findOne({email: email});
                    if(!user) {
                        let addNewUser = {
                            first_name: profile._json.name,
                            last_name: "-",
                            email: profile._json?.email || `${profile._json?.login}@gmail.com`,
                            age: 0,
                            role: "usuario",
                            password: "",
                        }
                        let newUser = await userModel.create(addNewUser);
                        done(null, newUser);
                    } else {
                        // si ya existe el usuario
                        done(null, user)
                    }

                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById({ _id: id});
        done(null, user);
    });
}

module.exports = initializePassport;