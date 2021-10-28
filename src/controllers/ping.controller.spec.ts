import App from "../app";


import { TestingDB } from "../testing/db";
import { PingController } from "./ping.controller";

import request from 'supertest';
import { Server } from "http";


describe('App', () => {

    let db:TestingDB
    let app:App
    let server:Server

    beforeAll(async () => {
        db = new TestingDB()
        await db.connect()
    })

    beforeEach(async () => {
        await db.reset()
        app = new App( [ new PingController ], 43999 )
        server = app.listen()
    })

    afterAll( async() => {
        await db.close()
    })


    describe('route /ping', () => {

        it('should GET', (done) => {
            request(server)
                .get('/api/ping')
                .set('Content-Type', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, function( error, response ) {
                    if ( error ) return done.fail(error)
                    expect( response.body ).toEqual({ 'message': 'pong' })
                    done()
                })
        })

    })


})