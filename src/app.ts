import cors from 'cors';
import express from 'express';
import { Application, NextFunction, Request, Response } from 'express';
import { HttpException } from './exceptions/http.exception';
import { Controller } from './interfaces/controller.interface';


export class App {
    public app: Application

    constructor( controllers:Controller[], public port: number ) {
        this.app = express()

        this.app.get("/", (request: Request, response: Response) => {
            return response.send("🦄")
        })

        this.initializeCors()
        this.initializeMiddleware()
        this.initializeSwagger()
        this.initializeControllers(controllers)
        this.initializeErrorHandling()

    }


    private initializeCors() {
        this.app.use( cors({origin: '*'}) )
    }

    private initializeControllers(controllers:any[]) {
        controllers.map( controller => this.app.use('/api/', controller.router) )
    }

    private initializeSwagger() {
        this.app.use("/",express.static("docs") )
        this.app.use("/",express.static("benchmark/output") )
        this.app.use("/api",express.static("public/swagger-ui-dist") )
    }


    private initializeErrorHandling() {
        this.app.use(
            (error: HttpException, request: Request, response: Response, next: NextFunction ) => {
                const status = error.status || 500;
                const message = error.message || "Something went wrong"
                response.status(status).send({ status, message })
            }
        )
    }

    private initializeMiddleware() {

        // json
        this.app.use( express.json() )
        this.app.use( express.urlencoded({
            extended: true
        }))

        // logging
        this.app.use( 
            (request: Request, response: Response, next:NextFunction ) => {
                console.log(`${request.method} ${request.path}`)
                next()
            }
        )

    }

    public listen() {
        this.app.listen( this.port, () => {
            console.log(`Server started at http://localhost:${ this.port }/api`)
        })
    }
}

export default App;