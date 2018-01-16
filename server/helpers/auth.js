var jwt = require("jsonwebtoken");

// Am I logged in? Check the token, see if it is valid and party on if so!
exports.ensureAuthenticated = function(req, res, next){
    // go to the headers
    if(req.headers['Authorization'] === undefined) {
        return res.status(401).send({
                message: 'INVALID TOKEN!'
        })
    }
    let authHeader = req.headers['Authorization']
    // grab the token
    let token = authHeader.split(" ")[1]
    // run jwt.verify on the token
    jwt.verify(token, "SECRET", function(err, decoded){
        if(err){
            return res.status(401).send({
                message: 'INVALID TOKEN!'
            })
        } else {
            return next()    
        }
    })
}

// Am I allowed to do X? Check the token, make sure its valid, check the decoded payload to make sure that req.params is the same as what is in the token
// users/1 -> make sure an id of 1 is in the token!
exports.ensureCorrectUser = function(req, res, next){
    // go to the headers
    if(req.headers['Authorization'] === undefined) {
        return res.status(401).send({
                message: 'INVALID TOKEN!'
        })
    }
    let authHeader = req.headers['Authorization']
    // grab the token
    let token = authHeader.split(" ")[1]
    eval(require("locus"));
    // run jwt.verify on the token
    var payload = jwt.decode(token)
    if(payload.currentUser === req.params.username){
      next();
    }else{
      return res.status(403).send({
          message: 'INVALID TOKEN!'
       })
    }
}
  // first - find a user by their username (which should always be unique)
//   User.findOne({ username: req.body.username }).then(
//     function(user) {
//       // then check to see if their password is the same as the hashed one
//       user.comparePassword(req.body.password, function(err, isMatch) {
//         if (isMatch) {
//           // if so - they are logged in!
//           res.send("logged in!");
//         } else {
//           res.redirect("/users/login");
//         }
//       });
//     },
//     function(err) {
//       res.send(err);
//     }
//   );
// });



