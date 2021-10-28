import App from "./app";
import { TestingDB } from "./testing/db";

describe('App', () => {

    let db:TestingDB

    beforeAll(async () => {
        db = new TestingDB()
        await db.connect()
    })

    beforeEach(async () => {
        await db.reset()
    })

    afterAll( async() => {
        await db.close()
    })

    it('should instantiate', () => {
        const app = new App([ ],  43999 )
        expect( app ).toBeTruthy()
    })

})