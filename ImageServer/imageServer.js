const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // Import the cors middleware

// Create the directory for storing images if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const app = express();
const port = 4000;
// Use the CORS middleware
app.use(cors());

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const imageName = req.body.name;
        console.log(uniqueSuffix)
        console.log(path.extname(file.originalname))
        console.log(imageName)
        cb(null, uniqueSuffix + '-' + imageName  + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/uploadPage.html');
});

app.use(express.urlencoded({ extended: true }));

// Serve static files (if you want to serve the uploaded images)
app.use('/uploads', express.static('uploads'));

// POST endpoint for image upload
app.post('/upload', upload.single('image'), (req, res) => {
    const imageName = req.body.name;
    const imageFile = req.file;

    if (!imageName || !imageFile) {
        return res.status(400).send('Image name and image file are required.');
    }

    //res.send(`Image uploaded successfully!\nName: ${imageName}\nFile: ${imageFile.filename}`);

    // Construct the image URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageFile.filename}`;
    console.log(imageUrl)
    res.json({ imageUrl });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
