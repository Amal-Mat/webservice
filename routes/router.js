const router = require('express').Router();
const baseAuthentication = require('../util/auth.js');
const userController = require('../Controller/usersController.js');

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

module.exports = router; 