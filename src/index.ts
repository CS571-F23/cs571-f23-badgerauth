import express, { Express } from 'express';

import { CS571WhatIsMyBidRoute } from './routes/what-is-my-bid';
import { CS571RequestCookieForBidRoute } from './routes/request-cookie-for-bid';
import { CS571VerifyBidRoute } from './routes/verify-bid';
import cookies from "cookie-parser";
import { CS571DbConnector } from './services/db-connector';
import BadgerAuthPublicConfig from './model/configs/badgerauth-public-config';
import { CS571Initializer } from '@cs571/f23-api-middleware';
import BadgerAuthSecretConfig from './model/configs/badgerauth-secret-config';


console.log("Welcome to the CS571 BadgerAuth Center!");

const app: Express = express();

app.use(cookies());

const appBundle = CS571Initializer.init<
  BadgerAuthPublicConfig,
  BadgerAuthSecretConfig
>(app, {
  allowNoAuth: [
    '/request-cookie-for-bid',
    '/what-is-my-bid',
    '/verify-bid'
  ] // i am auth
});

new CS571DbConnector(appBundle.config).init();

appBundle.router.addRoutes([
  new CS571WhatIsMyBidRoute(appBundle.config),
  new CS571RequestCookieForBidRoute(appBundle.config),
  new CS571VerifyBidRoute()
])

app.listen(appBundle.config.PORT, () => {
  console.log(`Running at http://localhost:${appBundle.config.PORT}`);
});