import { Router, Request, Response, NextFunction } from "express"


export class PingController {
    path:string = "/ping"
    router: Router = Router()

    constructor() {
        this.initializeRoutes()
    }

    private routeTo( action:Function ) {
        return ( ...args:any[] ) => action.call(this,...args)
    }

    initializeRoutes() {
        this.router.get( this.path, this.routeTo( this.ping ) )
    }

    async ping( request: Request, response:Response, next:NextFunction ) {
        const payload = { message: 'pong' }
        return response.send(payload)
    }

}