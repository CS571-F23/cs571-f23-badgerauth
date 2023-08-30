export class BadgerId {
    public readonly email: string;
    public readonly bid: string;
    public readonly iat: Date;
    public readonly eat?: Date;

    public constructor(
        email: string,
        bid: string,
        iat: Date,
        eat?: Date
    ) {
        this.email = email;
        this.bid = bid;
        this.iat = iat;
        this.eat = eat;
    }
}