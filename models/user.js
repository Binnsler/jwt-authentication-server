// Local definition of what a user is
const mongoose = require('mongoose');
// Schema is what we use to tell Mongoose about the fields we want to use
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');



// Define our model
const userSchema = new Schema({
  email: {type: String, unique: true, lowercase: true}, // first converted to lowercase
  password: String
});

// On Save Hook, encrypt password
// Before saving model, run this function
userSchema.pre('save', function(next){
  // Get access to user model
  const user = this;

  // Generate a 'salt' then run callback - a random generated string of charcters
  bcrypt.genSalt(10, function(err, salt){
    if(err){return next(err);}

    // 'Hash' (encrypt) our password using 'salt'
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err){return next(err);}

      // Overwrite plain text password with encrypted password
      user.password = hash;
      next(); // Now save model
    });
  });
});

// Methods attached to Schema
userSchema.methods.comparePassword = function(candidatePassword, callback){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if(err){return callback(err)}

    callback(null, isMatch);
  });
};

// Create the model class
const ModelClass = mongoose.model('user', userSchema); // corresponds to 'user' collection

// Export the model
module.exports = ModelClass;
