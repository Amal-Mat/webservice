var appRoot = require('app-root-path');
var winston = require('winston');

// Define custom settings for each transport (File, Console)
var options = {
    file: {
        level: 'info',
        filename: `${appRoot}/logs/combined.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

// Instantiate a new Winston Logger with the settings defined
var logger = new winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, //Do not exit on handled exceptions
});

// Create a stream object with a 'write' function
logger.stream = {
    write: function(message, encoding) {
        logger.info(message);
    },
};

module.exports = logger;