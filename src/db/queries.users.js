require("dotenv").config();
const User = require("./models").User;
const Collaborator = require('./models').Collaborator;
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


module.exports = {

  createUser(newUser, callback){
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    return User.create({
      name: newUser.name,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      const msg = {
        to: newUser.email,
        from: 'test@example.com',
        subject: 'Account confirmation',
        text: 'Welcome to Blocipedia!',
        html: '<strong>Please login to your account to start creating wikis!</strong>',
      };
      sgMail.send(msg);
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  upgrade(id, callback){
    return User.findById(id)
    .then((user) => {
      if(!user){
        return callback("User not found");
      }
      return user.updateAttributes({ role: "premium" })
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
  },

  downgrade(id, callback){
    return User.findById(id)
    .then((user) => {
      if(!user){
        return callback("User not found");
      }
      return user.updateAttributes({ role: "standard" })
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
  }

}
