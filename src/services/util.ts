import crypto from 'crypto'

export class Util {
    public static generateBadgerId(): string {
        return "bid_" + crypto.randomBytes(32).toString('hex');
    }
}