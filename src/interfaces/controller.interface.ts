import { Router } from "express";

export interface Controller {

    initializeRoutes: () => void

    path: string

    router: Router

    model?: any
}