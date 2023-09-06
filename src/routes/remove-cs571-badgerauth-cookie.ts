import { Express } from 'express';

import { CS571Config, CS571Route,  } from "@cs571/f23-api-middleware";
import BadgerAuthPublicConfig from '../model/configs/badgerauth-public-config';
import BadgerAuthSecretConfig from '../model/configs/badgerauth-secret-config';

export class CS571RemoveBadgerAuthCookieRoute implements CS571Route {

    public static readonly ROUTE_NAME: string = '/remove-cs571-badgerauth-cookie';

    private readonly config: CS571Config<BadgerAuthPublicConfig, BadgerAuthSecretConfig>;

    public constructor(config: CS571Config<BadgerAuthPublicConfig, BadgerAuthSecretConfig>) {
        this.config = config;
    }

    public addRoute(app: Express): void {
        app.delete(CS571RemoveBadgerAuthCookieRoute.ROUTE_NAME, (req, res) => {
            res.status(200).cookie('cs571_badgerauth', "goodbye", {
                domain: this.config.PUBLIC_CONFIG.IS_REMOTELY_HOSTED ? 'cs571.org' : undefined,
                secure: this.config.PUBLIC_CONFIG.IS_REMOTELY_HOSTED,
                sameSite: "lax",
                httpOnly: true,
                maxAge: 1000
            }).send({
                msg: 'Successfully logged out!'
            });
        })
    }

    public getRouteName(): string {
        return CS571RemoveBadgerAuthCookieRoute.ROUTE_NAME;
    }
}