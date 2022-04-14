const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const _ = require('underscore');
const db = require('../config/sequelizeDB.js');
const logger = require("../config/logger");
const SDC = require('statsd-client');
const dbConfig = require('../config/configDB.js');
const sdc = new SDC({host: dbConfig.METRICS_HOSTNAME, port: dbConfig.METRICS_PORT});
//const File = db.file;
const User = db.users;
const Image = db.image;
const util = require('util');
const { image } = require('../config/sequelizeDB.js');
const unlinkFile = util.promisify(fs.unlink)
require('dotenv').config();

const fileUpload = async (source, targetName, s3, fileId, req, res) => {
    fs.readFile(source, async (err, filedata) => {
        if (!err) {
            let s3_start = Date.now();
            console.log('s3', targetName)
            var user = await User.findOne({
                where: {
                    username: req.user.username
                }
            });

            
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: user.id+'/'+targetName,
                Body: filedata
            };

            await s3.upload(params, async (err, data) => {
                if (err) {
                    console.log('s3', err);
                    res.status(500).send({
                        message: err
                    });
                } else {
                    const aws_metadata = JSON.parse(JSON.stringify(data));

                    var image = {
                        id: uuidv4(),
                        file_name: targetName,
                        url: aws_metadata.Location,
                        user_id: user.id
                    };

                    Image.create(image).then(data => {
                        logger.info("Update user image: 201");
                        sdc.increment('endpoint.imageupload');
                        res.status(201). send({
                            file_name: data.file_name,
                            id: data.id,
                            url: data.url,
                            upload_date: data.updatedAt,
                            user_id: data.user_id
                        });
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while Image Creation!"
                        });
                    });
                }
            });
        } else {
            console.log("err", err)
            res.status(500).send({
                message: 'Some error occurred while creating an image!'
            });
        }
    });
}

const deleteFile = async (s3, image) => {
    let s3_start = Date.now();
    console.log("Delete File");
    let deleted = true;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: image.user_id+'/'+image.file_name
    }

    await s3.deleteObject(params, async(err, data) => {
        if (err) {
            console.log("Delete file err", err)
            deleted = false;
            logger.error(err)
        } else {
            console.log("Delete file success")
            logger.info("DeleteFile Success");
            sdc.increment('endpoint.deleteimage');

            await Image.destroy({
                where : {
                    id: image.id
                }
            }).then(data => {
                deleted=true;
            });
        }
    });
    return deleted;
}

module.exports = {
    fileUpload,
    deleteFile
};
