import path from 'path';
import { Connection, ConnectionOptions, createConnection } from "typeorm";

const entitiesPath = __dirname + '/../entities'
const entitiesExtension = path.extname(__filename)

const ormParams:ConnectionOptions = {
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    "entities": [`${entitiesPath}/*${entitiesExtension}`],
    "logging": false,
    "synchronize": false
}



export class TestingDB {

    connection: Connection

    async connect() {
        this.connection = await createConnection(ormParams)
        return this.connection
    }

    async reset() {
        await this.connection.dropDatabase();
        await this.connection.synchronize();
    }

    async close() {
        await this.connection.close()
        this.connection = undefined
    }

}