const cloudinary = require('cloudinary').v2; // Ensure correct Cloudinary version

cloudinary.config({
  cloud_name: "dq87kzuvj",
  api_key: "778936427144278",
  api_secret: "fV72zVHhu5t-Wz4Y4mo0zoQtKlc"
});

const multer = require('multer');

const cloudinaryStorage = multer.diskStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
  destination: function (req, file, cb) {
    cb(null, 'images/'); // Or any desired folder within your Cloudinary account
  }
});

const upload = multer({ storage: cloudinaryStorage });

module.exports = upload;
