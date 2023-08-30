import { Express } from 'express';

import jwt from 'jsonwebtoken';

import { CS571Route, CS571Config, CS571DefaultSecretConfig } from "@cs571/f23-api-middleware";
import { CS571DbConnector } from '../services/db-connector';

export class CS571RequestCookieForBidRoute implements CS571Route {

    public static readonly ROUTE_NAME: string = '/request-cookie-for-bid';

    private config: CS571Config<any, CS571DefaultSecretConfig>;
    private connector: CS571DbConnector;

    public constructor(config: CS571Config<any, CS571DefaultSecretConfig>, connector: CS571DbConnector) {
        this.config = config;
        this.connector = connector;
    }

    public addRoute(app: Express): void {
        app.post(CS571RequestCookieForBidRoute.ROUTE_NAME, (req, res) => {
            // check if req.header('Origin') matches an allowed origin
            const bid = req.body.bid;

            if (bid) {
                if (this.connector.isValidBID(bid)) {
                    const cookie = jwt.sign({ bid: bid }, this.config.SECRET_CONFIG.SESSION_SECRET, { expiresIn: '365d' });
                    res.status(200).cookie('cs571_bid', cookie, {
                        // domain: 'cs571.org', // todo allow switch
                        sameSite: "none",
                        secure: true,
                        httpOnly: true
                        // set token expir
                    }).send({
                        msg: 'Successfully logged in!'
                    });
                } else {
                    res.status(401).send({
                        msg: 'That is not a valid Badger ID!'
                    })
                }
            } else {
                res.status(400).send({
                    msg: 'Invalid request body'
                })
            }
        })
    }

    public getRouteName(): string {
        return CS571RequestCookieForBidRoute.ROUTE_NAME;
    }
}