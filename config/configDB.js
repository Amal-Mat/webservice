const env = process.env;
const fs = require('fs');
const rdsCa = fs.readFileSync('config/global-bundle.pem')

const config = {
    db: {
        host: env.DB_HOST,
        //Dev - 'csye6225.c5uf0qizsdwz.us-east-1.rds.amazonaws.com'
        //Demo - 'csye6225.cpifpfl2jetl.us-east-1.rds.amazonaws.com'
        //host: env.DB_HOST || 'localhost',
        user: env.DB_USER || 'csye6225',
        //user: env.DB_USER || 'root',
        password: env.DB_PASSWORD || 'Boston2021',
        //password: env.DB_PASSWORD || 'Boston@2021',
        database: env.DB_NAME || 'csye6225',
        //database: env.DB_NAME || 'usersDB',
        dialect: "mysql",
        dialectOptions: {
            ssl: 'Amazon RDS'
            }
        },
        port:3306,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    METRICS_HOSTNAME: "localhost",
    METRICS_PORT: 8125
};

module.exports = config;
