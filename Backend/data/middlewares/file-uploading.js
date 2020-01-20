const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
aws.config.update({
    secretAccessKey: 'EC0ub/5l5ATXfFiczBlW3c5F0l9sIFILeTG1JgM9',
    accessKeyId: 'AKIAJLTYZ77NNXXDT27Q',
    region: 'ap-south-1'
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        return cb(null,'');
    }
};
const upload = multer({
    fileFilter: fileFilter,
    storage: multerS3({
        acl: 'public-read',
        s3,
        bucket: 'chat-angular',
        key: function(req, file, cb) {
            /*I'm using Date.now() to make sure my file has a unique name*/
            req.file = Date.now() + file.originalname;
            cb(null, Date.now() + file.originalname);
        }
    })
});


module.exports = upload;