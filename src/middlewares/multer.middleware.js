const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp") //callback
    },

    filename: function (req, file, cb) {
        // for unique name of each uploaded file 
        //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
    }
})
  
const upload = multer({ storage, })

module.exports = upload


  
