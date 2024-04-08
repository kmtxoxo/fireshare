const express = require('express');
const ms = require('mediaserver');
const multer  = require('multer');
const fs = require('fs');
const NodeID3 = require('node-id3');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, "uploads") },
    filename: function (req, file, cb) { cb(null, file.originalname.replace(/\s/g, "")) }
});

const upload = multer({ storage: storage });


// ROUTES
router.get('/existing', function (req, res, next) {
    fs.readdir("uploads/", (err, items) => {
        if (err){
            res.send(err);
        }
        items = items.filter( (item) => {return item.includes(".mp3")} );
        res.send(items.slice(0,10))
    })
});

router.get('/existing/:name', function(req, res, next) {
   let readFileData = NodeID3.read( "uploads/" + req.params.name);
   console.log(req.params.name);
   res.send(readFileData)
});

router.get('/:name', function(req, res, next) {
    let file = req.params.name;
    console.log("filename " + file);
    ms.pipe(req, res, "uploads/" + file);
});

router.post('/',  upload.single('track'), function(req, res, next) {
    const file = req.file;

    if(!file){
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error)
    }

    let fileInfo = NodeID3.read(req.file.path);
    res.send(fileInfo)
});



module.exports = router;
