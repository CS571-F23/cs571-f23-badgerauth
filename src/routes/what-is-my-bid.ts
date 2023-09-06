import { Express } from 'express';

import jwt from 'jsonwebtoken';

import { CS571Config, CS571DefaultSecretConfig, CS571Route } from "@cs571/f23-api-middleware";
import { CS571OriginTracker } from '../services/origin-tracker';

export class CS571WhatIsMyBidRoute implements CS571Route {

    public static readonly ROUTE_NAME: string = '/what-is-my-bid';

    private config: CS571Config<any, CS571DefaultSecretConfig>;
    private originator: CS571OriginTracker;

    public constructor(config: CS571Config<any, CS571DefaultSecretConfig>, originator: CS571OriginTracker) {
        this.config = config;
        this.originator = originator;
    }

    public addRoute(app: Express): void {
        app.get(CS571WhatIsMyBidRoute.ROUTE_NAME, (req, res) => {
            jwt.verify(req.cookies?.cs571_bid, this.config.SECRET_CONFIG.SESSION_SECRET, (err: any, bid: any) => {
                if (err) {
                    res.status(401).send({
                        msg: "You must be logged in to check your Badger ID!"
                    });
                } else {
                    this.originator.addOriginIfDNE(String(req.header("Origin")), bid.bid);
                    // Acceptable risk, our server can only handle so much load!
                    res.status(200).set('Cache-control', 'private, max-age=60').send(bid); 
                }
            })
        })
    }

    public getRouteName(): string {
        return CS571WhatIsMyBidRoute.ROUTE_NAME;
    }
}