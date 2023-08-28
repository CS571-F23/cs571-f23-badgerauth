import { Express } from 'express';

import { CS571Route } from "@cs571/f23-api-middleware/src/interfaces/route";

export class CS571RevokeBidFromEmailRoute implements CS571Route {

    public static readonly ROUTE_NAME: string = '/add-bid-to-email';

    public addRoute(app: Express): void {
        app.delete(CS571RevokeBidFromEmailRoute.ROUTE_NAME, (req, res) => {
           
        })
    }

    public getRouteName(): string {
        return CS571RevokeBidFromEmailRoute.ROUTE_NAME;
    }
}