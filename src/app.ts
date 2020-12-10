import { createConnection } from 'typeorm';
import * as express from 'express';
import { Response, Request } from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser'

import routes from './routes';

const port = process.env.PORT || 3000;
const app: express.Application = express();


//Connects to the Database -> then starts the express
createConnection()
    .then(async connection => {
        //
        // Implement middlewares
        app.use(cors({
            origin: [
                'http://localhost:3000',
                'http://54.180.150.63:3000',
                'http://buenosvinos-client.s3-website.ap-northeast-2.amazonaws.com'
            ],
            methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'DELETE'],
            credentials: true,
          }));
        app.use(helmet());
        app.use(bodyParser.json());
        app.use(cookieParser())

        // Sets all routes
        app.use('/', routes);

        // Start server
        app.listen(port, () => {
            console.log(`Server started on port http://localhost:${port}`);
        });
    })
    .catch(error => console.log(error));
