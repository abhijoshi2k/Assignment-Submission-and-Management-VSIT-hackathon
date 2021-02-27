// Assigned Cloud name: dajkg7lwe
let ejs = require("ejs");
const express = require("express");
const router = express.Router();
const sharp = require("sharp");
const multer = require("multer");
const Class = require("../schema/classSchema");
const base64 = require('base64topdf');

/**
 * @method - POST
 * @route - /student/uploadAssignment
 * @param - None
 * @description - Uploads the Profile Pic for the User
 * @access - All
 */

router.post(
    "/student/uploadAssignment",
    async (req, res) => {
        try {
            if (req.isAuthenticated()) {
                const user = req.user;
                const code = "1";
                var userClassId = user.memberClass[code];
                console.log(req.file);
                if (!req.file) {
                    return res.status(404).send();
                }
                // Encoding the PDF to base64
                let encodedPdf = base64.base64Encode(req.file);

                // Append to the classSchema Assignment

                //   user.userClassId.assignments.append = {
                //     givenDate,
                //     dueDate,
                //     title,
                //     description,
                //     submissions:{
                //         email,
                //         time,
                //         note,
                //         grade
                //     }
                //   }
                //   await user.save();
                // await class.save();
                res.status(201).send(buffer);
            } else {
                res.render('register');
            }

        } catch (e) {
            console.log(e);
            res.status(400).send(e);
        }
    }
);

/**
 * @method - GET
 * @route - /uploadAssignment
 * @param - None
 * @description - Upload PDF assignment to Cloudinary
 * @access - ADMINS
 * @use - ALL
 */
router.get("/uploadAssignment", async (req, res) => {
    try {
        res.render("upload");
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;