const { registerUser } = require("../controller/user.controller");
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
    registerUser)


module.exports = router
