import { Express } from 'express';

import jwt from 'jsonwebtoken';

import { CS571Config, CS571DefaultSecretConfig, CS571Route } from '@cs571/f23-api-middleware';

export class CS571VerifyEmailRoute implements CS571Route {

    public static readonly ROUTE_NAME: string = '/verify-email';

    private config: CS571Config<any, CS571DefaultSecretConfig>;

    public constructor(config: CS571Config<any, CS571DefaultSecretConfig>) {
        this.config = config;
    }

    public addRoute(app: Express): void {
        app.post(CS571VerifyEmailRoute.ROUTE_NAME, (req, res) => {
            // check if req.header('Origin') matches an allowed origin
            const bid = req.body.bid;
            if (bid === 'bid_123abc' || bid === 'bid_456def') {
                const cookie = jwt.sign({canManage: true}, this.config.SECRET_CONFIG.SESSION_SECRET, { expiresIn: '365d' });
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
        })
    }

    public getRouteName(): string {
        return CS571VerifyEmailRoute.ROUTE_NAME;
    }
}