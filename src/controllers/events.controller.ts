import { Router, Request, Response, NextFunction } from "express"
import { HttpException } from "../exceptions/http.exception"
import { getConnection, In } from "typeorm"

import { Attendee, AttendeeSession, Event, Registration, Session, Ticket } from "../entities/events.entities"
import { EventRegistrationData } from "../interfaces/event-registration-data.interface"
import { EventRegistrationValidator} from "../validators/event-registration.validator"
import { validationMiddleware } from "../middleware/validation.middleware"


const ACTIVE_STATUSES = [ "open", "sold out" ]


export class EventsController {
    path:string = "/events"
    router: Router = Router()

    connection = getConnection()
    eventsRepository = this.connection.getRepository(Event)

    constructor() {
        this.initializeRoutes()
    }

    private routeTo( action:Function ) {
        return ( ...args:any[] ) => action.call(this,...args)
    }

    initializeRoutes() {
        this.router.get( this.path, this.routeTo( this.list ) )
        this.router.get( `${this.path}/:id`, this.routeTo( this.retrieve ) )
        this.router.post( 
            `${this.path}/:id/register`, 
            validationMiddleware(EventRegistrationValidator),
            this.routeTo( this.register ) 
        )
    }

    /**
     * List active events
     */
    async list( request: Request, response: Response, next: NextFunction ) {
        
        try {
            let events = await this.connection.manager
            .find(Event, { where: { status: In(ACTIVE_STATUSES) }, order: { time_start: 'ASC' } } )
            
            
            return response.send(events)
        }
        catch(error) {
            next(error)
        }

    }

    /**
     * Retrieve an event
     */
    async retrieve( request: Request, response: Response, next: NextFunction ) {
        if ( ! request.params.id ) 
            next( new HttpException(400, 'Bad request') )

        const id:number = parseInt(request.params.id)

        try {
            const event = await this._getEventAndActiveTicketsAndSessions(id)
            return response.send(event)
        }
        catch ( error ) {
            next(error)
        }

    }

    /**
     * Register an event
     * @param request 
     * @param response 
     * @param next 
     * @returns 
     */
    async register( request: Request, response: Response, next: NextFunction ) {
        if ( ! request.params.id ) 
            next( new HttpException(400, 'Bad request') )
        
        const id:number = parseInt(request.params.id)
        const data:EventRegistrationData = request.body

        try {
            const event = await this._getEventAndActiveTicketsAndSessions(id)
            const registration = await this._saveEventRegistration( event, data )
            return response.send({ id: registration.id })
        }
        catch ( error ) {
            next( error )
        }
    }


    private async _saveEventRegistration( event:Event, data:EventRegistrationData) {
        
        const errors:string[] = []

        const registration = new Registration()
        registration.event = event
        registration.attendees = [ ]

        if ( event.status == "sold out" ) {
            throw( new HttpException(400,"Event is sold out") )
        }
        if ( event.status != "open" ) {
            throw( new HttpException(404,"Not found") )
        }

        for ( let a of data.attendees ) {
            const ticket = event.tickets.find( t => t.id === a.ticket )

            /* don't allow a ticket which does not belong to the event */
            if ( ! ticket ) {
                errors.push(`Invalid ticket type`)
                continue;
            }
            /* don't allow sold out tickets */
            if ( ticket.status == "sold out" ) {
                const message = `Ticket ${ticket.label} is sold out`
                errors.push(message)
                continue
            }
            /* don't allow tickets which are not open */
            if ( ticket.status != "open" ) {
                const message = `Invalid ticket type`
                errors.push(message)
                continue
            }

            /* create attendee */
            const attendee = new Attendee()
            const attendeeData = Object.assign({ }, a)
            delete attendeeData.sessions
            delete attendeeData.ticket
            Object.assign(attendee, attendeeData)
            attendee.event = event
            attendee.registration = registration
            attendee.ticket = ticket
            attendee.ticket_price = ticket.price
            attendee.total_sessions_price = 0
            attendee.total_price = 0
            attendee.sessions = []

            registration.attendees.push(attendee)


            for ( let sessionId of a.sessions ) {
                const session = event.sessions.find( s => s.id === sessionId )

                /* do not allow sessions which do not belong to the event */
                if ( ! session ) {
                    errors.push(`Invalid session`)
                    break;
                }
                /* do not allow sold out sessions */
                if ( session.status ==  "sold out" ) {
                    const message = `Session ${session.label} is sold out`
                    errors.push(message)
                    continue
                }
                /* do not allow essions which are not open */
                if ( session.status !=  "open" ) {
                    const message = `Invalid session`
                    errors.push(message)
                    continue
                }

                /* calculate totals */
                const attendeeSession = new AttendeeSession()
                attendeeSession.attendee = attendee
                attendeeSession.session = session
                attendeeSession.registration = registration
                attendeeSession.price = session.price
                attendee.total_sessions_price += session.price
                attendee.total_price += session.price
                attendee.sessions.push(attendeeSession)
                registration.total_tickets += 1
            }

            registration.total_price += attendee.total_price

            await this.connection.manager.save(Registration, registration)
        }

        if ( errors.length > 0 ) {
            const deduped = Array.from( new Set( errors ) )
            throw(new HttpException(400,deduped.join("\n")))
        }

        return registration
    }


    private async _getEventAndActiveTicketsAndSessions(id:number) {

        let event = await this.connection.manager.findOne(Event, id)

        // event not found
        if ( ! event ) 
            throw new HttpException(404, 'Event not found')
        
        // 404 if event is not active
        if ( ! ACTIVE_STATUSES.includes(event.status) ) 
            throw new HttpException(404, 'Event not found')
            
        // get tickets
        event.tickets = await this.connection
            .createQueryBuilder(Ticket, 'ticket')
            .where('ticket.event = :event', { event: event.id } )
            .andWhere("ticket.status IN(:...statuses)", { statuses: ACTIVE_STATUSES } )
            .getMany()

        // get sessions
        event.sessions = await this.connection
            .createQueryBuilder(Session, 'session')
            .where('session.event = :event', { event: event.id } )
            .andWhere("session.status IN(:...statuses)", { statuses: ACTIVE_STATUSES } )
            .getMany()

        return event
    }
}