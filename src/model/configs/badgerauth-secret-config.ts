export default interface BadgerAuthSecretConfig {
    SQL_CONN_ADDR: string;
    SQL_CONN_PORT: number;
    SQL_CONN_USER: string;
    SQL_CONN_PASS: string;
    SESSION_SECRET: string;
}