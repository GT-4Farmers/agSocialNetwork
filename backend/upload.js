//this is me mainly copying the stuff from the video Jeff posted
// i am personally not totally sure what needs to be here and what does not

const express = require('express');
const aws = require('aws-sdk');
const multers3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const { config } = require('process');

const router = express.Router();

aws.config.loadFromPath('./aws.json'); //Set this up and make sure it's in gitignore

// console.log(config.accessKeyId)

const s3 = new aws.S3({
    signatureVersion: 'v4',
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKeyId,
    Bucket: 'haystackimages'
})

//link to the s3 bucket on aws using our keys

   //from the example used by the video for single image upload
   //no idea what it might actually do
var post_media_upload = multer({
    storage: multers3({
    s3: s3,
    bucket: 'haystackimages',
    acl : 'public-read',
    // i think this is the name of the file that is beign uploaded to aws
    // the time stamp it genius because we may not need versioning with this
    //talk to jeff about it and see how accurate the date.now() method is
    key: function (req, file, cb) {
    cb(null, req.session.userID + "/" + path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname)) //not even remotely sure what this does.
    }
}),
limits: {filesize : 2000000}, //filesize in bytes, see if what we need to limit this to for post uploads
filefilter: function(req, file, cb) {
    checkFileType(file, cb);
}
}).single('image');

// just checks that the file extension matches our allowed types
// only image file extensions for now
function checkFileType(file, cb) {
    //allowed extensions for now only image extenstions
    const filetypes = /jpeg|jpg|png/;
    //check the extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime?
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only');
    }
}

module.exports = post_media_upload


