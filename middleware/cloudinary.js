const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dq87kzuvj",
  api_key: "778936427144278",
  api_secret: "fV72zVHhu5t-Wz4Y4mo0zoQtKlc"
});

module.exports = cloudinary;