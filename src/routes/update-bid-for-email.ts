import { Express } from 'express';

import { CS571Route } from "@cs571/f23-api-middleware/src/interfaces/route";

export class CS571UpdateBidForEmailRoute implements CS571Route {

    public static readonly ROUTE_NAME: string = '/update-bid-for-email';

    public addRoute(app: Express): void {
        app.post(CS571UpdateBidForEmailRoute.ROUTE_NAME, (req, res) => {
           
        })
    }

    public getRouteName(): string {
        return CS571UpdateBidForEmailRoute.ROUTE_NAME;
    }
}