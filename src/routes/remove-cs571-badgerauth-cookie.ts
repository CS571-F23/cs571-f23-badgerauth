import { Express } from 'express';

import { CS571Route,  } from "@cs571/f23-api-middleware";

export class CS571RemoveBadgerAuthCookieRoute implements CS571Route {

    public static readonly ROUTE_NAME: string = '/remove-cs571-badgerauth-cookie';

    public addRoute(app: Express): void {
        app.delete(CS571RemoveBadgerAuthCookieRoute.ROUTE_NAME, (req, res) => {
            res.status(200).cookie('cs571_badgerauth', "goodbye", {
                // domain: 'cs571.org', // todo allow switch
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