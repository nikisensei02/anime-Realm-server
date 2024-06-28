// backend/middleware/multer.js
const multer = require('multer');

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        // Define filename (you can modify filename as per your requirement)
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Initialize multer upload middleware
const upload = multer({ storage });

module.exports = upload;
