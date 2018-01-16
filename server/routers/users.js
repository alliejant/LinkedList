const express = require("express");
const { userHandler } = require("../handlers");
const router = express.Router();
const {ensureAuthenticated, ensureCorrectUser} = require("../helpers/auth")

router
	.route("")

	.get(/*ensureAuthenticated,*/ userHandler.readUsers)
	.post(userHandler.createUser);

router 
    .route("/login")
    .post(userHandler.logIn)

router
	.route("/:username")
	.get(ensureAuthenticated, userHandler.readUser)
	.patch(ensureAuthenticated, ensureCorrectUser, userHandler.updateUser)
	.delete(ensureAuthenticated, ensureCorrectUser, userHandler.deleteUser);



module.exports = router;
