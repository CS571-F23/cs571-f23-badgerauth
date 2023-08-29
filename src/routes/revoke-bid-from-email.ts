import { Express } from 'express';

import { CS571Route } from "@cs571/f23-api-middleware/src/interfaces/route";
import { CS571Verifier } from '../services/verifier';

export class CS571RevokeBidFromEmailRoute implements CS571Route {

    private readonly verifier: CS571Verifier;

    public static readonly ROUTE_NAME: string = '/add-bid-to-email';

    public constructor(verifier: CS571Verifier) {
        this.verifier = verifier;
    }

    public addRoute(app: Express): void {
        app.delete(CS571RevokeBidFromEmailRoute.ROUTE_NAME, (req, res) => {
            this.verifier.getEmailFromJWT(req.cookies['badgerauth_manage']).then(email => {
                if (email) {
                    // TODO Remove from DB table
                } else {
                    res.status(401).send({ msg: "Not a valid session." })
                }
            })
        })
    }

    public getRouteName(): string {
        return CS571RevokeBidFromEmailRoute.ROUTE_NAME;
    }
}