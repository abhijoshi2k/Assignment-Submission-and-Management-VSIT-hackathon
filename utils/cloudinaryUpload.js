// Assigned Cloud name: dajkg7lwe
let ejs = require("ejs");
const express = require('express')
const router = express.Router()
var cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
}); 

/**
 * @method - POST
 * @route - /uploadAssignment
 * @param - PDF to be uploaded
 * @description - Upload PDF assignment to Cloudinary
 * @access - ADMINS
 * @use - ALL
 */
router.post('/uploadAssignment', async (req, res) => {
    try {
        var userPDF = req.body.userPDF
        console.log(req.body)
        cloudinary.uploader.upload(userPDF,
            function (error, result) {
                console.log(result, error);
            }
        );
    } catch (e) {
        res.status(500).send()
    }
});

router.get('/uploadAssignment', async (req, res) => {
    try {
        res.render('upload')
    } catch (e) {
        res.status(500).send()
    }
});

module.exports = router