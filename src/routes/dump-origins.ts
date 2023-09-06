import { CS571Config, CS571Route } from "@cs571/f23-api-middleware";

import { Express } from 'express';
import BadgerAuthSecretConfig from "../model/configs/badgerauth-secret-config";
import { CS571DbConnector } from "../services/db-connector";
import { CS571Emailer } from "../services/emailer";
import { BadgerId } from "../model/badger-id";
import { CS571NotifyBidEmail } from "../model/emails/notify-bid-email";
import { CS571OriginTracker } from "../services/origin-tracker";


export class CS571DumpOriginsRoute implements CS571Route {

    public static readonly ROUTE_NAME: string = '/dump-origins';

    private readonly config: CS571Config<any, BadgerAuthSecretConfig>;
    private readonly originator: CS571OriginTracker;

    public constructor(config: CS571Config<any, BadgerAuthSecretConfig>, originator: CS571OriginTracker) {
        this.config = config;
        this.originator = originator;
    }

    public addRoute(app: Express): void {
        app.get(CS571DumpOriginsRoute.ROUTE_NAME, (req, res) => {
            const secret: string = String(req.header('X-CS571-SECRET'));
            if (secret === this.config.SECRET_CONFIG.X_CS571_SECRET) {
                res.status(200).send(Array.from(this.originator.origins).reduce((prev: any, curr: any) => {
                    return {
                        ...prev,
                        [curr[0]]: curr[1]
                    }
                }, {}));
            } else {
                res.status(400).send({
                    msg: 'Invalid request'
                })
            }
        })
    }

    public getRouteName(): string {
        return CS571DumpOriginsRoute.ROUTE_NAME;
    }
}