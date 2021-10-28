import { Connection } from "typeorm";
import { TestingDB } from "./db";

describe('App', () => {

    it('should instantiate', async () => {
        const db = new TestingDB()
        expect( db ).toBeTruthy()
    })

    it('should create a database connection', async () => {
        const db = new TestingDB()
        const c = await db.connect()
        expect(c).toBeTruthy();
        expect(c).toBeInstanceOf(Connection)
        expect(db.connection).toBe(c)
        await db.close()
    })

    it('should close the database', async() => {
        const db = new TestingDB()
        const c = await db.connect()
        spyOn(c,'close').and.callThrough()

        await db.close()
        expect(c.close).toHaveBeenCalled()
        expect(db.connection).toBeUndefined()
    })

    it('should reset the database', async () => {
        const db = new TestingDB()
        const c = await db.connect()
        spyOn(c,'dropDatabase')
        spyOn(c,'synchronize')

        await db.reset()

        expect(c.dropDatabase).toHaveBeenCalled()
        expect(c.synchronize).toHaveBeenCalled()

        await db.close()
    })
    
})