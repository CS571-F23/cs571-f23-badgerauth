import { Express } from 'express';

import { CS571Route } from "@cs571/f23-api-middleware/src/interfaces/route";

export class CS571VerifyBidRoute implements CS571Route {

    public static readonly ROUTE_NAME: string = '/verify-bid';

    public addRoute(app: Express): void {
        app.get(CS571VerifyBidRoute.ROUTE_NAME, (req, res) => {
            // check if req.header('Origin') matches an allowed origin
            if (req.header('X-CS571-ID') === 'bid_abc123' || req.header('X-CS571-ID') === 'bid_fde987') {
                res.status(200).send({
                    name: "you are cool!"
                });
            } else {
                res.status(200).send({
                    name: "unknown"
                });
            }
            
        })
    }

    public getRouteName(): string {
        return CS571VerifyBidRoute.ROUTE_NAME;
    }
}