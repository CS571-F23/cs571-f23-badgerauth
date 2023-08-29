export default interface BadgerAuthSecretConfig {
    SQL_CONN_ADDR: string;
    SQL_CONN_PORT: number;
    SQL_CONN_USER: string;
    SQL_CONN_PASS: string;
    SESSION_SECRET: string;
    EMAIL_VERIF_SECRET: string;
    EMAIL_SERV: string;
    EMAIL_ADDR: string;
    EMAIL_PASS: string;
}