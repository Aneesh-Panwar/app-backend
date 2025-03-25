const { registerUser, logoutUser, loginUser, refreshAccessToken } = require("../controller/user.controller");
const { varifyJwt } = require("../middlewares/auth.midleware");
const upload = require("../middlewares/multer.middleware");

const router = require("express").Router();

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        },
    ]),
    registerUser);

router.route("/login").post(loginUser)
router.route("/logout").post(varifyJwt,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)


module.exports = router
