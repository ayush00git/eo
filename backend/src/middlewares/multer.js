const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        cb(null, "data.csv");
    },
});
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp/image");
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const fileExtension = file.originalname.split('.').pop(); 
        cb(null, `image_${timestamp}.${fileExtension}`);
    },
});

const upload = multer({ storage: storage });
const uploadImage = multer({ storage: imageStorage });

module.exports = { upload,uploadImage };
