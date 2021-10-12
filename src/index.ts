/* load enviroment variables from .env file */
import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });

/* Type ORM */
import { ConnectionOptions, createConnection } from 'typeorm'

/* App */
import App from './app';
import { EventsController } from './controllers/events.controller';
import populateMockData from './mockdata';


import path from 'path'
import throng from 'throng'


const entitiesPath = __dirname + '/entities'
const entitiesExtension = path.extname(__filename)




const PORT = process.env.PORT ? parseInt(process.env.PORT) : 43200;
const WORKERS = process.env.WEB_CONCURRENCY || 1;


const ormParams:ConnectionOptions = {
    type: "mysql",
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_HOST ? parseInt(process.env.MYSQL_HOST) : 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    "entities": [`${entitiesPath}/*${entitiesExtension}`],
    "logging": false,
    "synchronize": true,
    "bigNumberStrings": false,
}


throng({workers: WORKERS, start: start});

async function start( id:number ) {

    try {
        const params = id == 1 ? { ...ormParams } : { ...ormParams, loggin: true, synchronize: true }
        const connection = await createConnection(params)

        if ( id == 1 ) {
            console.log(`Database: ${process.env.MYSQL_DATABASE} on ${process.env.MYSQL_HOST}`)
        }

        if ( id == 1 && process.env.RELOAD_DATA != "false" ) {
            await populateMockData(connection)
        }

        console.log(`Started worker ${id}`)
        
        const app = new App([
            new EventsController()
        ],  PORT )
        app.listen()
    }
    catch (error) {
        console.log("Error connecting to database", error)
    }

   

}




