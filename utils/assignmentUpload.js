// Assigned Cloud name: dajkg7lwe
let ejs = require("ejs");
const express = require("express");
const router = express.Router();
const sharp = require("sharp");
const multer = require("multer");
const Class = require("../schema/classSchema");

// Configuring Multer to upload files
const upload = multer({
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    // console.log(file)
    if (!file.originalname.match(/\.(pdf|docx|odt)$/)) {
      return cb(new Error("Please upload in correct image format"));
    }

    cb(undefined, true);
  },
});

/**
 * @method - POST
 * @route - /student/uploadAssignment
 * @param - None
 * @description - Uploads the Profile Pic for the User
 * @access - All
 */

router.post(
  "/student/uploadAssignment",
  upload.single("avatar"),
  authenticateToken,
  async (req, res) => {
    try {
      const user = req.user;
      const code = "1";
      var userClassId = user.memberClass[code];
      console.log(req.file);
      if (!req.file.buffer) {
        return res.status(404).send();
      }
      // console.log(req.file.buffer)
      const buffer = await (
        await sharp(req.file.buffer)
          .toBuffer()
      ).toString("base64");

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
