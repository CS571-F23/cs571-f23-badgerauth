import { Express } from 'express';

import jwt from 'jsonwebtoken';

import { CS571Config, CS571DefaultSecretConfig, CS571Route } from '@cs571/f23-api-middleware';
import { CS571Emailer } from '../services/emailer';
import { CS571Verifier } from '../services/verifier';
import { CS571ConfirmAddressEmail } from '../model/emails/confirm-addr-email';

export class CS571RequestVerifyEmailRoute implements CS571Route {

    public static readonly ROUTE_NAME: string = '/request-verify-email';

    private readonly config: CS571Config<any, CS571DefaultSecretConfig>;
    private readonly emailer: CS571Emailer;
    private readonly verifier: CS571Verifier;

    public constructor(config: CS571Config<any, CS571DefaultSecretConfig>, emailer: CS571Emailer, verifier: CS571Verifier) {
        this.config = config;
        this.emailer = emailer;
        this.verifier = verifier;
    }

    public addRoute(app: Express): void {
        app.post(CS571RequestVerifyEmailRoute.ROUTE_NAME, (req, res) => {
            const email = req.body.email;
            if (
                email &&
                CS571Emailer.isValidEmail(email) &&
                CS571Emailer.isWiscEmail(email)
            ) {
                const sess = this.verifier.createSession(email);
                this.emailer.email(
                    new CS571ConfirmAddressEmail(sess.email, sess.code)
                ).then(() => {
                    res.status(200).send({
                        email: sess.email,
                        iat: sess.iat,
                        eat: sess.eat
                    })
                }).catch(() => {
                    res.status(500).send({
                        msg: "There was an issue sending the verification code. Try again in a few minutes."
                    })
                })
                
            } else {
                res.status(401).send({
                    msg: "The email provided is not valid or is not a University of Wisconsin-Madison email address."
                })
            }
        })
    }

    public getRouteName(): string {
        return CS571RequestVerifyEmailRoute.ROUTE_NAME;
    }

    
}