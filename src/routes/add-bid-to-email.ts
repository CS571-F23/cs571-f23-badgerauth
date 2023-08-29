import { Express } from 'express';

import { CS571Route } from "@cs571/f23-api-middleware";
import { CS571Verifier } from '../services/verifier';
import { CS571DbConnector } from '../services/db-connector';

export class CS571AddBidToEmailRoute implements CS571Route {

    private readonly verifier: CS571Verifier;
    private readonly connector: CS571DbConnector;

    public static readonly ROUTE_NAME: string = '/add-bid-to-email';

    public constructor(verifier: CS571Verifier, connector: CS571DbConnector) {
        this.verifier = verifier;
        this.connector = connector;
    }

    public addRoute(app: Express): void {
        app.post(CS571AddBidToEmailRoute.ROUTE_NAME, (req, res) => {
            this.verifier.getEmailFromJWT(req.cookies['badgerauth_manage']).then(email => {
                if (email) {
                    // TODO Add to DB table
                } else {
                    res.status(401).send({ msg: "Not a valid session." })
                }
            })
        })
    }

    public getRouteName(): string {
        return CS571AddBidToEmailRoute.ROUTE_NAME;
    }
}