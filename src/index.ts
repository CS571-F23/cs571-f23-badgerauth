import express, { Express } from 'express';

import { CS571WhatIsMyBidRoute } from './routes/what-is-my-bid';
import { CS571RequestCookieForBidRoute } from './routes/request-cookie-for-bid';
import { CS571VerifyBidRoute } from './routes/verify-bid';
import cookies from "cookie-parser";
import { CS571DbConnector } from './services/db-connector';
import BadgerAuthPublicConfig from './model/configs/badgerauth-public-config';
import { CS571Initializer } from '@cs571/f23-api-middleware';
import BadgerAuthSecretConfig from './model/configs/badgerauth-secret-config';
import { CS571Emailer } from './services/emailer';
import { CS571Verifier } from './services/verifier';
import { CS571RequestVerifyEmailRoute } from './routes/request-verify-email';
import { CS571AddBidToEmailRoute } from './routes/add-bid-to-email';
import { CS571ApproveVerifyEmailRoute } from './routes/approve-verify-email';
import { CS571RevokeBidFromEmailRoute } from './routes/revoke-bid-from-email';
import { CS571GetAllBidsRoute } from './routes/get-all-bids';


console.log("Welcome to the CS571 BadgerAuth Center!");

const app: Express = express();

app.use(cookies());

const appBundle = CS571Initializer.init<
  BadgerAuthPublicConfig,
  BadgerAuthSecretConfig
>(app, {
  allowNoAuth: [
    '/add-bid-to-email',
    '/approve-verify-email',
    '/get-all-bids',
    '/request-cookie-for-bid',
    '/request-verify-email',
    '/revoke-bid-from-email',
    '/verify-bid',
    '/what-is-my-bid'
  ]
});

const db = new CS571DbConnector(appBundle.config);
const emailer = new CS571Emailer(appBundle.config)
const verifier = new CS571Verifier(appBundle.config.SECRET_CONFIG.EMAIL_VERIF_SECRET);

db.init();

appBundle.router.addRoutes([
  new CS571AddBidToEmailRoute(verifier, db),
  new CS571ApproveVerifyEmailRoute(appBundle.config, emailer, verifier),
  new CS571GetAllBidsRoute(appBundle.config, db),
  new CS571RequestCookieForBidRoute(appBundle.config, db),
  new CS571RequestVerifyEmailRoute(appBundle.config, emailer, verifier),
  new CS571RevokeBidFromEmailRoute(verifier, db),
  new CS571VerifyBidRoute(db),
  new CS571WhatIsMyBidRoute(appBundle.config),
])

app.listen(appBundle.config.PORT, () => {
  console.log(`Running at http://localhost:${appBundle.config.PORT}`);
});
