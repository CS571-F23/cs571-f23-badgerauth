export class CS571OriginTracker {

    public readonly origins: Map<string, string[]>;

    public constructor() {
        this.origins = new Map<string, string[]>();
    }

    public addOriginIfDNE(origin: string, bid: string) {
        let canonicalOrigin = origin;
        if (!this.origins.has(canonicalOrigin)) {
            this.origins.set(canonicalOrigin, []);
        }
        const bids = this.origins.get(canonicalOrigin);
        if (!bids?.includes(bid)) {
            bids?.push(bid);
        }
    }
}