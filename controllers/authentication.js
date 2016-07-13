const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');

// Create a JWT for the user
function tokenForUser(user){
  const timestamp = new Date().getTime();
  return jwt.encode({sub: user.id, iat: timestamp}, config.secret); // Subject of token
}

// Signin functionality
exports.signin = function(req, res, next){
  // User has already had their email and password auth'd, just need token
  res.send({token: tokenForUser(req.user)});
};

// Signup functionality
exports.signup = function(req, res, next){
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password){
    return res.status(422).send({error: 'You must provide email and password'});
  }

  // See if user with given email exists
  User.findOne({email: email}, function(err, existingUser){
    if(err){return next(err);}

    // If a user with email does exist, return an Error
    if(existingUser){
      return res.status(422).send({error: 'Email is in use'}); // Error 422: Unprocessable entity
    }

    // If email does NOT exist, create and save new user
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err){
      if(err){return next(err);}

      // Respond to request indicating user was created
      res.json({token: tokenForUser(user)});
    });
  });
};
