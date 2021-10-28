import request from 'supertest';
import { Server } from "http";
import { Connection } from "typeorm";

import App from "../app";
import { TestingDB } from "../testing/db";
import { EventsController } from "./events.controller";

import { Event } from "../entities/events.entities";

const apiRoot = '/api'


describe('App', () => {

    let db:TestingDB
    let app:App
    let server:Server

    let data = getMockData()

    beforeAll(async () => {
        db = new TestingDB()
        await db.connect()
    })

    beforeEach(async () => {
        await db.reset()
        await populateMockData( db.connection )
        app = new App( [ new EventsController() ], 43999 )
        server = app.listen()
    })

    afterEach( () => {
        server.close()
    })

    afterAll( async() => {
        await db.close()
    })


    describe('/api/events', () => {
        describe('GET', () => {
            it('should be ok', () => {
                request(server)
                    .get(`${apiRoot}/events`)
                    .set('Content-Type', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
            })
            it('should return only active events', (done) => {
                request(server)
                .get(`${apiRoot}/events`)
                .set('Content-Type', 'application/json')
                .expect(200, function( error, response ) {
                    if ( error ) return done.fail(error)

                    const p = response.body
                    expect( p.length ).toEqual(2)
                    done()
                })
            })
            it('should return events in order by start time', () => {

            })

        })
    })

    fdescribe('/api/events/:id', () => {
        describe('GET', () => {
            fit('should be ok', () => {
                request(server)
                    .get(`${apiRoot}/events/1`)
                    .set('Content-Type', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
            })
            fit('should return the requested record', (done) => {
                request(server)
                    .get(`${apiRoot}/events/1`)
                    .set('Content-Type', 'application/json')
                    .expect(200, function( error, response ) {
                        if ( error ) return done.fail(error)

                        const p = response.body
                        expect( p.name ).toEqual( data[0].name )
                        done()
                    })
            })
            fit('should return a 404 response', (done) => {
                request(server)
                    .get(`${apiRoot}/events/999`)
                    .set('Content-Type', 'application/json')
                    .expect(404, () => {
                        done()
                    } )
            })
        })
    })


    xdescribe('/api/events/:id/register', () => {
        describe('POST', () => {


            describe('single attendee, no sessions', () => {
                let postData = {
                    attendees: [
                        {
                            first_name: "Dahlia",
                            last_name: "Antunez",
                            email: "dantunez@geemail.com",
                            phone: "(555) 555 - 5555",
                            company: "Some random company",
                            ticket: 1,
                            sessions: [ ] as any[]
                        }
                    ]
                }

                it('should be ok', () => {
                    request(server)
                        .get(`${apiRoot}/events`)
                        .set('Content-Type', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(201)
                })
    

    
            })

            describe('single attendee, one session', () => {

            })

            describe('single attendee, multiple sessions', () => {

            })

            describe('invalid ticket id', () => {

            })

            describe('ticket id belongs to another event', () => {

            })

            describe('event is not active', () => {

                describe('event is draft', () => {

                })

                describe('event is closed', () => {

                })

                describe('event is sold out', () => {

                })

            })

            describe('ticket id is not active', () => {

                describe('ticket id is draft', () => {

                })

                describe('ticket id is closed', () => {

                })

                describe('ticket id is sold out', () => {

                })

            })

            describe('invalid session id', () => {

            })

            describe('multiple attendees, no sessions', () => {

            })






            fit('should return the requested record', (done) => {
                request(server)
                    .get(`${apiRoot}/events/1`)
                    .set('Content-Type', 'application/json')
                    .expect(200, function( error, response ) {
                        if ( error ) return done.fail(error)

                        const p = response.body
                        expect( p.name ).toEqual( data[0].name )
                        done()
                    })
            })

            it('should return a 404 response', () => {

            })
        })
    })


})



async function populateMockData( connection:Connection ) {
    for ( let itemData of getMockData() ) {
        const event = new Event()
        Object.assign(event, itemData)
        await connection.manager.save(Event, event)
    }
}

function getMockData() {
    return [
        {
            id: 1,
            name: "Foo Event",
            time_start: "2022-12-01 17:00:00",
            time_end: "2022-12-01 21:00:00",
            location_name: "Some Fancy Place",
            location_address: "Winners Circle, Town Heights",
            contact_phone: "(555) 555-5555",
            contact_email: "fooname@geemail.com",
            description: `Foo some description`,
            status: "open",
            tickets: [ ] as any[],
            sessions: [ ] as any[] 
        },
        {
            id: 2,
            name: "Bar Event",
            time_start: "2022-01-23 17:00:00",
            time_end: "2022-01-23 21:00:00",
            location_name: "Some Fancy Place",
            location_address: "Winners Circle, Town Heights",
            contact_phone: "(555) 555-5555",
            contact_email: "booname@geemail.com",
            description: `Boo some description`,
            status: "sold out",
            tickets: [ ] as any[],
            sessions: [ ] as any[] 
        },
        {
            id: 3,
            name: "Baz Event",
            time_start: "2021-10-23 17:00:00",
            time_end: "2021-10-23 21:00:00",
            location_name: "Some Fancy Place",
            location_address: "Winners Circle, Town Heights",
            contact_phone: "(555) 555-5555",
            contact_email: "booname@geemail.com",
            description: `Boo some description`,
            status: "closed",
            tickets: [ ] as any[],
            sessions: [ ] as any[] 
        },
        {
            id: 4,
            name: "Biz Event",
            time_start: "2021-10-23 17:00:00",
            time_end: "2021-10-23 21:00:00",
            location_name: "Some Fancy Place",
            location_address: "Winners Circle, Town Heights",
            contact_phone: "(555) 555-5555",
            contact_email: "booname@geemail.com",
            description: `Boo some description`,
            status: "draft",
            tickets: [ ] as any[],
            sessions: [ ] as any[] 
        },


    ]
}



