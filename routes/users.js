const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/database");
const User = require("../models/user");

//Register
 router.post("/register", (req, res, next) => {
  //res.send('REGISTER');
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });
  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({ success: false, msg: "Failed to register user" });
    } else {
      res.json({ success: true, msg: "User registered" });
    }
  });
});
 

//Authenticate
 router.post("/authenticate", (req, res, next) => {
  //res.send('AUTHENTICATE');
  const username = req.body.username;
  const password = req.body.password;
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: "User not found!" });
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign({
          type: "user",
          data:{
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
         },config.secret,{
           expiresIn: 604800
         }
        );
        return res.json({
           success: true,
           token: "JWT "+ token,
            user:{
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
        }else{
          return res.json({
             success: true,
             msg: "Worng Password."
          });
        }
    });
  });
});
  


//Profile
router.get("/profile", passport.authenticate('jwt', {session: false}), (req, res, next) => {
 // res.send("PROFILE");
 res.json({user: req.user});
}); 
 
/* router.get("/profile", passport.authenticate('jwt', {session: false}), (req,res) =>{
  console.log(req.user);
 return res.json(
   req.user
 );
})
  */

module.exports = router;
