const Constants = require("../constants");
const multer = require("multer");

const MIME_TYPES_ALLOWED = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/gif': 'gif'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!MIME_TYPES_ALLOWED[file.mimetype]) {
            return callback(Constants.IMAGE_TYPES_ALLOWED)
        }
        cb(null, './Backend/data/uploads')
    },
    filename: function (req, file, cb) {
        const ext  = MIME_TYPES_ALLOWED[file.mimetype];
        let fileName = "userimage_" + new Date().getTime() + "." + ext;
        cb(null, fileName)
    }
})
var upload = multer({ storage: storage });