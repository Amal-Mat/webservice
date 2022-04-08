const db = require('../config/sequelizeDB.js');
const User = db.users;
const bcrypt = require('bcrypt');
const {v4:uuidv4} = require('uuid');
const logger = require("../config/logger");
const SDC = require('statsd-client');
const dbConfig = require('../config/configDB.js');
const sdc = new SDC({host: dbConfig.METRICS_HOSTNAME, port: dbConfig.METRICS_PORT});


// Create a User

async function createUser (req, res, next) {
    var hash = await bcrypt.hash(req.body.password, 10);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if(!emailRegex.test(req.body.username)) {
        logger.info("/Create user: 400");
        res.status(400).send({
            message: 'Enter your Email ID in correct format. Example: abc@xyz.com'
        });
    }
    const getUser = await User .findOne({where: {username: req.body.username}}).catch(err => {
        logger.error("/Create user: 500");
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
        logger.info("/Create user: 200");
        sdc.increment('endpoint.createuser');
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
        logger.error("Error while creating the user!: 500");
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the user!"
        });
    });
    }
}

//Get a User

async function getUser(req, res, next) {
    const user = await getUserByUsername(req.user.username);
    if (user) {
        logger.info("Get user: 200");
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
}

// Update a user

async function updateUser(req, res, next) {
    if(req.body.username != req.user.username) {
        logger.error("Cannot update user: 400");
        res.status(400);
    }
    if(!req.body.first_name || !req.body.last_name || !req.body.username || !req.body.password) {
        logger.error("/Update User failed: 400");
        res.status(400).send({
            message: 'Enter all parameters!'
        });
    }
    User.update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: await bcrypt.hash(req.body.password, 10)
    }, {where : {username: req.user.username}}).then((result) => {
        if (result == 1) {
            logger.info("Update user: 204");
            sdc.increment('endpoint.updateuser');
            res.sendStatus(204);
        } else {
            res.sendStatus(400);
        }   
    }).catch(err => {
        res.status(500).send({
            message: 'Error Updating the user'
        });
    });
}

async function getUserByUsername(username) {
    return User.findOne({where : {username: username}});
}

async function comparePasswords (existingPassword, currentPassword) {
    return bcrypt.compare(existingPassword, currentPassword);
}

module.exports = {
    createUser: createUser,
    getUser: getUser,
    getUserByUsername: getUserByUsername,
    comparePasswords: comparePasswords,
    updateUser: updateUser
};
