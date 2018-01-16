const bcrypt = require("bcrypt");
const { User, Company } = require("../models");
var jwt = require("jsonwebtoken");

function logIn(req, res, next) {
  // first - find a user by their username (which should always be unique)
  User.findOne({ username: req.body.data.username })
    .then(
      function(user) {
        console.log("user in Login", user);
        console.log("username & password",req.body.data.username, req.body.data.password);
        // then check to see if their password is the same as the hashed one
        user.comparePassword(req.body.data.password, function(err, isMatch) {
          console.log("isMatch", isMatch)
          if (isMatch) {
            // if so - they are logged in!
            var token = jwt.sign({currentUser: user.username}, "SECRET", {
              expiresIn: 60 * 60 // expire in one hour
            });
            res.status(200).json({message: 'Authenticated!',
            token: token
            });  
          } else {
            console.log(err);
            res.status(400).json({ message: 'Invalid Credentials' });
          }
        });
      },
      function(err) {
        res.send(err);
      }
  );
}

function readUsers(req, res, next) {
  User.find()
    .then(users => res.status(200).json({ data: users }))
    .catch(err => next(err));
}

async function createUser(req, res, next) {
  try {
    const newUser = new User(req.body.data);
    console.log("newUser", newUser);
    await newUser.save();
    if (newUser.currentCompany) {
      await Company.findByIdAndUpdate(newUser.currentCompany, {
        $addToSet: { employees: newUser._id }
      });
    }
    res.status(201).json({ data: newUser });
  } catch (e) {
    console.log("error createUser");
    next(e);
  }
}

function readUser(req, res, next) {
  User.findOne({ username: req.params.username })
    .then(user => res.status(200).json({ data: user }))
    .catch(err => next(err));
}

//is updating the user, but does not send updated user in json
async function updateUser(req, res, next) {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user.currentCompany !== req.body.data.currentCompany) {
      //eval(require("locus"));
      if (user.currentCompany) {
        await Company.findByIdAndUpdate(user.currentCompany, {
          $pull: { employees: user._id }
        });
      }
      if (req.body.data.currentCompany) {
        await Company.findByIdAndUpdate(req.body.data.currentCompany, {
          $addToSet: { employees: user._id }
        });
      }
    }
    console.log("updatedUser");
    const updatedUser = await User.findOneAndUpdate(
      { username: req.params.username },
      req.body.data,
      { new: true }
    );
    res.status(200).json({ data: updatedUser });
  } catch (e) {
    console.log("error updateUser");
    next(e);
  }
}

async function deleteUser(req, res, next) {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user.currentCompany) {
      await Company.findByIdAndUpdate(user.currentCompany, {
        $pull: { employees: user._id }
      });
    }
    await User.findOneAndRemove({ username: req.params.username });
    res.status(200).json({ data: user });
  } catch (e) {
    console.log("error deleteUser");
    next(e);
  }
}

module.exports = {
  readUsers,
  createUser,
  readUser,
  updateUser,
  deleteUser,
  logIn
};
