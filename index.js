const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const connectRedis = require('./database/redis')
const { setupRabbitMQ } = require('./publisher/publisher')
const { CustomError } = require('./error-manager/errorManager')

const routesV1 = require('./routesV1')

const start = async () => {
    await connectRedis();
    await setupRabbitMQ();
    const app = express();

    app.set('etag', false);
    app.use(express.json());

    app.use('/', (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        let version = '1.0';

        const acceptHeader = req.headers['accept'];
        if (acceptHeader) {
            if (acceptHeader.includes('fhirVersion=')) {
                let versionArr = acceptHeader.split('fhirVersion=');
                if (versionArr.length > 1) {
                    version = versionArr[1];
                }
            }
        }

        switch(version) {
            case '1.0':
                return routesV1(req, res, next);
            default:
                return res.status(404).send();
        }
    })

    app.use((err, req, res, next) => {
        if (err instanceof CustomError) {
            if (!err.message) {
                return res.status(err.status_code).send();
            }
            
            return res.status(err.status_code).send({
                message: err.message,
                status_code: err.status_code
            });
        }
        
        console.log(err)
        return res.status(500).send();
    })

    app.all('*', async (req, res) => {
        return res.status(404).send();
    })

    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    })
}

start();


