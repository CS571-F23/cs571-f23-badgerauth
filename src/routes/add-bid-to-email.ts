import { Express } from 'express';

import { CS571Route } from "@cs571/f23-api-middleware";

export class CS571AddBidToEmailRoute implements CS571Route {

    public static readonly ROUTE_NAME: string = '/add-bid-to-email';

    public addRoute(app: Express): void {
        app.post(CS571AddBidToEmailRoute.ROUTE_NAME, (req, res) => {
           
        })
    }

    public getRouteName(): string {
        return CS571AddBidToEmailRoute.ROUTE_NAME;
    }
}