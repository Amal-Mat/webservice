const router = require('express').Router();

router.get("/healthz", (req, res) => {
    console.log("Is it hitting?")
    res.sendStatus(200).json();
});

module.exports = router;