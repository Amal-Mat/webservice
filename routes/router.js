const router = require('express').Router();
const bcrypt = require('bcrypt');
const db = require('../config/sequelizeDB.js');
const {v4:uuidv4} = require('uuid');
//const baseAuthentication = require('../util/auth.js');
const User = db.users;

router.get("/healthz", (req, res) => {
    console.log("Is it hitting?")
    res.sendStatus(200).json();
});

// Creating a user

router.post("/v1/user", async(req, res, next) => {
    var hash = await bcrypt.hash(req.body.password, 10);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if(!emailRegex.test(req.body.username)) {
        res.status(400).send({
            message: 'Enter your Email ID in correct format. Example: abc@xyz.com'
        });
    }
    const getUser = await User .findOne({where: {username: req.body.username}}).catch(err => {
        res.status(500).send({
            message: err.message || 'Some error occurred while creating the user'
        });
    });
    if(getUser) {
        res.status(400).send({
            message: 'User already exists!'
        });
    } else {
        var user = {
            id: uuidv4(),
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: hash,
            username: req.body.username
        };
    
    

    User.create(user).then(data => {
        res.status(201).send({
            id: data.id,
            first_name: data.first_name,
            last_name: data.last_name,
            username: data.username,
            account_created: data.createdAt,
            account_updated: data.updatedAt
        });
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the user!"
        });
    });
    };
});

// Get User Details 

router.get("/v1/user/self", baseAuthentication() ,async (req, res, next) => {
    const user = await getUserByUsername(req.user.username);
    if (user) {
        res.status(200).send({
            id: user.dataValues.id,
            first_name: user.dataValues.first_name,
            last_name: user.dataValues.last_name,
            username: user.dataValues.username,
            account_created: user.dataValues.createdAt,
            account_updated: user.dataValues.updatedAt
        });
    } else {
        res.status(400).send({
            message: 'User not found!'
        });
    }
});

// Update a user

router.put("/v1/user/self", baseAuthentication() ,async (req, res, next) => {
    if(req.body.username != req.user.username) {
        res.status(400);
    }
    User.update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: await bcrypt.hash(req.body.password, 10)
    }, {where : {username: req.user.username}}).then((res) => {
        if (res == 1) {
            res.sendStatus(204);
        } else {
            res.sendStatus(400);
        }
    }).catch(err => {
        res.status(500).send({
            message: 'Error Updating the user'
        });
    });
});

async function getUserByUsername(username) {
    return User.findOne({where : {username: username}});
}

async function comparePasswords (existingPassword, currentPassword) {
    return bcrypt.compare(existingPassword, currentPassword);
}

function baseAuthentication() {
    return [async (req, res, next) => {
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
            return res.status(401).json({message: 'Missing Authorization Header'});
        }

        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');
        var isValid;
        console.log("---------", username, password)
        await getUserByUsername(username).then(async (res) => {
            if (!res) {
                return res.status(401).json({
                    message: 'Invalid Authentication Credentials'
                });
            }
            console.log("---------", res.dataValues.password)
            isValid = await comparePasswords(password, res.dataValues.password);
            
        });

        if (!isValid) {
            return res.status(401).json({
                message: 'Invalid Authentication Credentials'
            });
        } else {
            req.user = {username: username, password: password};
            next();
        }
    }];
}

module.exports = {
    getUserByUsername: getUserByUsername,
    comparePasswords: comparePasswords
};
module.exports = router;