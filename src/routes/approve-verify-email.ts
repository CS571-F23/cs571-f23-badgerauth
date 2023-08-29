import { Express } from 'express';

import jwt from 'jsonwebtoken';

import { CS571Config, CS571Route } from '@cs571/f23-api-middleware';
import { CS571Emailer } from '../services/emailer';
import { CS571Verifier } from '../services/verifier';
import BadgerAuthSecretConfig from '../model/configs/badgerauth-secret-config';

export class CS571ApproveVerifyEmailRoute implements CS571Route {

    public static readonly ROUTE_NAME: string = '/approve-verify-email';

    private readonly config: CS571Config<any, BadgerAuthSecretConfig>;
    private readonly emailer: CS571Emailer;
    private readonly verifier: CS571Verifier;

    public constructor(config: CS571Config<any, BadgerAuthSecretConfig>, emailer: CS571Emailer, verifier: CS571Verifier) {
        this.config = config;
        this.emailer = emailer;
        this.verifier = verifier;
    }

    public addRoute(app: Express): void {
        app.post(CS571ApproveVerifyEmailRoute.ROUTE_NAME, (req, res) => {
            const email = req.body.email;
            const code = req.body.code;
            if (
                email &&
                code &&
                this.verifier.checkValidSession(email, code)
            ) {
                res.status(200).cookie(
                    'badgerauth_manage',
                    jwt.sign(
                        { email: email },
                        this.config.SECRET_CONFIG.EMAIL_VERIF_SECRET,
                        { expiresIn: '3600s' }
                    ),
                    {
                        // domain: 'cs571.org',
                        sameSite: "lax",
                        // secure: true,
                        maxAge: 3600000,
                        httpOnly: true
                    }
                ).send({
                    msg: "Successfully authenticated."
                });
            } else {
                res.status(401).send({
                    msg: "Not a valid session."
                })
            }
        })
    }

    public getRouteName(): string {
        return CS571ApproveVerifyEmailRoute.ROUTE_NAME;
    }

    
}