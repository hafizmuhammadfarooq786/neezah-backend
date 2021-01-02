var express = require("express");
var router = express.Router();
var userController = require("../controllers/UserControllers");

router.post("/login", function (req, res) {
  res.json(userController.loginUser(req.body));
});
router.post("/signup", function (req, res) {
  res.json(userController.signUpUser(req.body));
});
router.get("/users/all", function (req, res) {
  res.json(userController.getAllUsers());
});
router.post("/user/uuid", function (req, res) {
  res.json(userController.getUserByUUID(req.body));
});
router.post("/reset-password", function (req, res) {
  res.json(userController.resetPassword(req.body));
});
router.post("/update-profile", function (req, res) {
  res.json(userController.updateUserProfile(req.body));
});
router.post("/update-email-address", function (req, res) {
  res.json(userController.updateEmail(req.body));
});

module.exports = router;
