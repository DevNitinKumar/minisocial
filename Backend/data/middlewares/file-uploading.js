let multer = require('multer');
let cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: 'minisocial', 
    api_key: '843155316276214', 
    api_secret: 'egQz2RZQ20EjmSrV6CLF20Ifovo' 
});


module.exports.uploadTocloud = function(req,res,callback) {
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
            cb(null,true)
        }
    })
    const upload = multer({ storage: storage }).array('file');
    upload(req, res, (err) => {
        if (err) {
            console.log(err)
            return callback(Constants.IMAGE_UPLOADING_ERROR);
        }
        // Middleware.deleteImageFromLocall(req.file);
        return callback(null, req.file.path);
    })
}

module.exports.uploadToCloud = multer({
    storage : multer.diskStorage({
        destination: (req, file, cb) => {
            if (!MIME_TYPES_ALLOWED[file.mimetype]) {
                return callback(Constants.IMAGE_TYPES_ALLOWED)
            }
            cb(null, './Backend/data/uploads')
        },
    }),
    fileFilter : (req, file, cb) => {
        if(!file.mimetype.match(/jpg|jpeg|png|gif$i/)) {
            console.log(file.mimetype)
            return cb('',false);
        } else {
            console.log(req.file)
            console.log(req.files)
            // cloudinary.uploader.upload(file.originalname, function(error, result) {
            //     console.log(result, error)
            // });
            // cb(null, true);
        }
    }
});



// const aws = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');
// aws.config.update({
//     secretAccessKey: 'YMQGzHKymFedMzvC5ksQFh6Au6cfbaJ9nj4JuWYT',
//     accessKeyId: 'AKIAINI4TXWR6KVW4RKQ',
//     region: 'ap-south-1'
// });

// const s3 = new aws.S3();

// const fileFilter = (req, file, cb) => {
//     if(!file.mimetype.match(/jpg|jpeg|png|gif$i/)) {
//         return cb('',false);
//     }
//     cb(null, true);
//     // if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     // } else {
//     //     return cb(null,'');
//     // }
// };
// const upload = multer({
//     fileFilter: fileFilter,
//     storage: multerS3({
//         acl: 'public-read',
//         s3,
//         bucket: 'chat-angular',
//         key: function(req, file, cb) {
//             /*I'm using Date.now() to make sure my file has a unique name*/
//             req.file = Date.now() + file.originalname;
//             cb(null, Date.now() + file.originalname);
//         }
//     })
// });
