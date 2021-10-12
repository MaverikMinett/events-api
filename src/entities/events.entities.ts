
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, Index } from "typeorm";

import { Status } from "../types/status";


@Entity('events')
export class Event {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 128 })
    name: string

    @Column('text')
    description: string

    @Column({ type: 'varchar', length: 64})
    location_name: string = ""

    @Column({ type: 'varchar', length: 128})
    location_address: string = ""

    @Column({ type: 'varchar', length: 64})
    contact_email: string = ""

    @Column({ type: 'varchar', length: 32})
    contact_phone: string = ""

    @Index()
    @Column({ type: 'varchar', length: 8})
    status: Status = "draft"

    @Column('datetime')
    time_start: Date;

    @Column('datetime')
    time_end: string;

    @OneToMany(type => Ticket, ticket => ticket.event )
    tickets: Ticket[]

    @OneToMany( type => Session, session => session.event )
    sessions: Session[]

    @OneToMany( type => Registration, registration => registration.event )
    registrations: Registration[]

    @OneToMany( type => Attendee, attendee => attendee.event )
    attendees: Attendee[]
}

/**
 * Ticket refers to an available ticket type/tier for a given event
 */
@Entity('event_tickets')
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number

    @Index()
    @ManyToOne( type => Event, event => event.tickets, { onDelete: 'CASCADE' } )
    event: Event

    @Column({ length: 128 })
    label: string

    @Column('text')
    description: string = ""

    @Column("decimal", { precision: 11, scale: 2 })
    price: number = 0

    @Index()
    @Column({ type: 'varchar', length: 8})
    status: Status = "draft" 
    
    @OneToMany( type => Attendee, attendee => attendee.ticket )
    attendees: Attendee[]
}

@Entity('event_sessions')
export class Session {
    @PrimaryGeneratedColumn()
    id: number

    @Index()
    @ManyToOne( type => Event, event => event.sessions, { onDelete: 'CASCADE' } )
    event: Event

    @Column({ length: 128 })
    label: string

    @Column('text')
    description: string = ""

    @Column("decimal", { precision: 11, scale: 2 })
    price: number

    @Index()
    @Column({ type: 'varchar', length: 8})
    status: Status = "draft"    

    @OneToMany( type => AttendeeSession, attendeeSession => attendeeSession.session )
    attendeeSessions: AttendeeSession[]
}

/* the "cart" */
@Entity('event_registrations')
export class Registration {
    @PrimaryGeneratedColumn()
    id: number

    @Index()
    @ManyToOne( type => Event, event => event.registrations, {  onDelete: 'RESTRICT' } )
    event: Event

    @Column()
    total_tickets: number = 0

    @Column("decimal", { precision: 20, scale: 2 })
    total_price: number = 0

    @OneToMany( type => Attendee, attendee => attendee.registration, { cascade: ['insert','update'] } )
    attendees: Attendee[]

    @OneToMany( type => AttendeeSession, attendeeSession => attendeeSession.registration )
    attendeeSessions: AttendeeSession[]
}

@Entity('event_registration_attendees')
export class Attendee {
    @PrimaryGeneratedColumn()
    id: number

    @Index()
    @ManyToOne( type => Registration, registration => registration.attendees, { onDelete: 'RESTRICT' } )
    registration: Registration

    @Index()
    @ManyToOne( type => Event, event => event.attendees, { onDelete: 'RESTRICT' } )
    event: Event

    @Index()
    @ManyToOne( type => Ticket, ticket => ticket.attendees, { onDelete: 'RESTRICT' } )
    ticket: Ticket

    @Column({length: 64})
    first_name: string

    @Column({length: 64})
    last_name: string

    @Column({length: 64})
    email: string

    @Column({length: 128})
    company: string

    @Column({length: 32})
    phone: string

    @Column("decimal", { precision: 9, scale: 2 })
    ticket_price: number

    @Column("decimal", { precision: 20, scale: 2 })
    total_sessions_price: number

    @Column("decimal", { precision: 20, scale: 2 })
    total_price: number

    @OneToMany( type => AttendeeSession, session => session.attendee, { cascade: ['insert','update'] } )
    sessions: AttendeeSession[]
}


@Entity('event_registration_attendee_sessions')
export class AttendeeSession {
    @PrimaryGeneratedColumn()
    id: number

    @Index()
    @ManyToOne( type => Registration, registration => registration.attendeeSessions, { onDelete: 'CASCADE' } )
    registration: Registration

    @Index()
    @ManyToOne( type => Attendee, attendee => attendee.sessions, { onDelete: 'RESTRICT' } )
    attendee: Attendee

    @Index()
    @ManyToOne( type => Session, session => session.attendeeSessions, { onDelete: 'RESTRICT' } )
    session: Session

    @Column("decimal", { precision: 9, scale: 2 })
    price: number = 0.00
}