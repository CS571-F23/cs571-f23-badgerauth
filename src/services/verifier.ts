import crypto from 'crypto'

import jwt from 'jsonwebtoken';

import { EmailVerificationSession } from '../model/email-verification-session';

export class CS571Verifier {

    private readonly jwtSecret: string;
    private sessions: EmailVerificationSession[];

    public constructor(jwtSecret: string, periodicPurge: boolean = true) {
        this.jwtSecret = jwtSecret;
        this.sessions = [];

        if (periodicPurge) {
            setInterval(() => {
                this.purge();
            }, 60 * 1000)
        }
    }

    public purge(): void {
        this.sessions = this.sessions.filter((sess) => !sess.isExpired());
    }

    public createSession(email: string): EmailVerificationSession {
        return this.createSessionFromCode(email, CS571Verifier.genCode())
    }

    public createSessionFromCode(email: string, code: string): EmailVerificationSession {
        const sess = new EmailVerificationSession(email, code);
        this.sessions = [...this.sessions, sess];
        return sess;
    }

    public checkValidSession(email: string, code: string): boolean {
        return this.sessions.some((sess) => 
            sess.email === email &&
            sess.code === code &&
            !sess.isExpired()
        );
    }

    // https://stackoverflow.com/questions/46108249/promises-vs-async-with-jsonwebtokens
    public async getEmailFromJWT(token: any): Promise<string | undefined>{
        return new Promise((resolve,reject) =>
            jwt.verify(
                token,
                this.jwtSecret,
                (err: any, decoded: any) => err ? 
                    resolve(undefined) : 
                    resolve(decoded)
            )
        );
    }

    private static genCode() {
        return crypto.randomBytes(6).toString('hex');
    }
}