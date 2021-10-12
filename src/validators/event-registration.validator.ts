import { IsArray, IsEmail, IsNotEmpty, IsString, MaxLength, ValidateNested } from "class-validator"
import { Type } from 'class-transformer'

export class EventRegistrationAttendeeValidator {
    @IsString()
    @MaxLength(64)
    @IsNotEmpty()
    first_name:string

    @IsString()
    @MaxLength(64)
    @IsNotEmpty()
    last_name:string

    @IsEmail()
    @MaxLength(64)
    @IsNotEmpty()
    email:string

    @IsString()
    @MaxLength(32)
    phone:string 

    @IsString()
    @MaxLength(128)
    company:string
}

export class EventRegistrationValidator {
    @IsArray()
    @ValidateNested()
    @Type( () => EventRegistrationAttendeeValidator)
    attendees: EventRegistrationAttendeeValidator[]
}