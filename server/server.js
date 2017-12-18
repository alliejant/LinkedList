const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const {
	setUpBodyParser,
	setUpHeaders,
	setUpMongoose
} = require("./middleware");

const app = express();

setUpBodyParser(app, bodyParser);
setUpHeaders(app);
setUpMongoose(mongoose);

//root route
app.get("/", (req, res, next) => {
	return res.json("Go to /users, /companies, or /jobs");
});

//resource routes
const { usersRouter, companiesRouter /*jobsRouter*/ } = require("./routers");

app.use("/users", usersRouter);
app.use("/companies", companiesRouter);
/*app.use('/jobs', jobsRouter);*/

//error handler
app.use((err, req, res, next) => {
	console.error(err);

	// toJSON for the Error object was just an empty object
	res.json(err);
});

module.exports = app;
