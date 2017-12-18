const { User, Company } = require("../models");

function readUsers(req, res, next) {
  User.find()
    .then(users => res.status(200).json({ data: users }))
    .catch(err => next(err));
}

function createUser(req, res, next) {
  const newUser = new User(req.body.data);
  newUser
    .save()
    .then(user => {
      if (user.currentCompany) {
        Company.findByIdAndUpdate(user.currentCompany, {
          $addToSet: { employees: user._id }
        })
          .then(company => {
            res.status(201).json({ data: user });
          })
          .catch(err => {
            return next(err);
          });
      }
      res.send(201).json({ data: user });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
}

function readUser(req, res, next) {
  User.findOne({ username: req.params.username })
    .then(user => res.status(200).json({ data: user }))
    .catch(err => next(err));
}

//is updating the user, but does not send updated user in json
function updateUser(req, res, next) {
  User.findOneAndUpdate({ username: req.params.username }, req.body.data, {
    runValidators: true
  })
    .then(user => {
      if (user.currentCompany !== req.body.data.currentCompany) {
        const oldCompanyPromise = Company.findByIdAndUpdate(
          user.currentCompany,
          {
            $pull: { employees: user._id }
          }
        );
        const newCompanyPromise = Company.findByIdAndUpdate(req.body, {
          $addToSet: { employees: user._id }
        });
        Promise.all([oldCompanyPromise, newCompanyPromise])
          .then(promises => {
            res.status(201).json({ data: user });
          })
          .catch(err => {
            return next(err);
          });
      }
      res.status(200).json({ data: user });
    })
    .catch(err => next(err));
}

function deleteUser(req, res, next) {
  User.findOneAndRemove({ username: req.params.username })
    .then(user => res.status(200).json({ data: user }))
    .catch(err => next(err));
}

module.exports = {
  readUsers,
  createUser,
  readUser,
  updateUser,
  deleteUser
};
