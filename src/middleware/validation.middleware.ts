import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { HttpException } from "../exceptions/http.exception";


function getValidationErrorMessages( e:ValidationError ) {
    const m:string[] = []
    if ( e.constraints ) {
        m.push(...Object.values(e.constraints) )
    }
    if ( e.children ) {
        const childMessages:string[] = []
        for ( let c of e.children ) {
            childMessages.push( ...getValidationErrorMessages(c) )
        }
        m.push( ...childMessages )
    }
    return m
}


export function validationMiddleware<T>(type: any, skipMissingProperties:boolean = false): RequestHandler {
    
    return ( request: Request, response: Response, next: NextFunction ) => {
        
        validate( plainToClass(type, request.body), { skipMissingProperties } )
            .then( 
                ( errors: ValidationError[] ) => {
                    if ( errors.length > 0 ) {

                        const messages: string[] = []
                        for ( let e of errors ) {
                            messages.push( ...getValidationErrorMessages(e) )
                        }

                        const deduped = Array.from( new Set( messages ) )
                        const message = "There was an error processing your request:\n\n" + deduped.join("\n")
                        next( new HttpException(400, message ) )
                    }
                    else {
                        next()
                    }
                }
            )
    }
}