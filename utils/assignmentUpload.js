// Assigned Cloud name: dajkg7lwe
let ejs = require('ejs');
const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const multer = require('multer');
const Class = require('../schema/classSchema');
const base64 = require('base64topdf');

/**
 * @method - POST
 * @route - /student/uploadAssignment
 * @param - None
 * @description - Uploads the Profile Pic for the User
 * @access - All
 */

/**
 * @method - GET
 * @route - /uploadAssignment
 * @param - None
 * @description - Upload PDF assignment to Cloudinary
 * @access - ADMINS
 * @use - ALL
 */
router.get('/uploadAssignment', async (req, res) => {
	try {
		res.render('upload');
	} catch (e) {
		res.status(500).send();
	}
});

module.exports = router;
