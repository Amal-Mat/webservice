const router = require('express').Router();
const baseAuthentication = require('../util/auth.js');
const userController = require('../Controller/usersController.js');
const imageController = require('../Controller/imageController.js');
const multer = require('multer');

// GET Method

router.get("/healthz", (req, res) => {
    console.log("Is it hitting?")
    res.sendStatus(200).json();
});

// POST Method

router.post("/v1/user", userController.createUser);

// GET Method (With Authentication)

router.get("/v1/user/self", baseAuthentication() , userController.getUser);

// PUT Method

router.put("/v1/user/self", baseAuthentication() , userController.updateUser);

// POST Method (Image)

const upload = multer({
    dest: 'uploads/'
})

router.post("/v1/user/self/pic", baseAuthentication(), upload.single('file'), imageController.updateUserPic);

// GET Method (Image)

router.get("/v1/user/self/pic", baseAuthentication(), imageController.getUserPic);

// DELETE Method (Image)

router.delete("/v1/user/self/pic", baseAuthentication(), imageController.deleteUserPic);

module.exports = router; 