const { Company } = require("../models");

function readCompanies(req, res, next) {
  Company.find()
    .populate("employees")
    .populate("jobs")
    .then(companies => res.status(200).json({ data: companies }))
    .catch(err => next(err));
}

function createCompany(req, res, next) {
  const company = new Company(req.body.data);
  company.handle = `@${req.body.data.handle}`;
  company
    .save()
    .then(company => res.status(201).json({ data: company }))
    .catch(err => next(err));
}

function readCompany(req, res, next) {
  Company.findOne({ handle: `@${req.params.handle}` })
    .populate("employees")
    .populate("jobs")
    .then(company => res.status(200).json({ data: company }))
    .catch(err => next(err));
}

//is updating the company, but does not send updated company in json
function updateCompany(req, res, next) {
  req.body.data.handle = `@${req.body.data.handle}`;
  Company.findOneAndUpdate({ handle: `@${req.params.handle}` }, req.body.data, {
    runValidators: true
  })
    .then(company => res.status(200).json({ data: company }))
    .catch(err => next(err));
}

function deleteCompany(req, res, next) {
  Company.findOneAndRemove({ handle: `@${req.params.handle}` })
    .then(company => res.status(200).json({ data: company }))
    .catch(err => next(err));
}

module.exports = {
  readCompanies,
  createCompany,
  readCompany,
  updateCompany,
  deleteCompany
};
