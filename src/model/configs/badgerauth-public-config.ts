import { CS571DefaultPublicConfig } from "@cs571/f23-api-middleware";

export default interface BadgerAuthPublicConfig extends CS571DefaultPublicConfig {
    ENABLE_CAPTCHA: string;
}