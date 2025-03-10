const { registerUser } = require("../controller/user.controller");

const router = require("express").Router();

router.route("/register").post(registerUser)

module.exports = router
