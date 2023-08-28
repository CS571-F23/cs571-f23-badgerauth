
import { DataTypes, Sequelize, Model } from "sequelize";
import BadgerAuthSecretConfig from "../model/configs/badgerauth-secret-config";
import BadgerAuthPublicConfig from "../model/configs/badgerauth-public-config";
import { CS571Config } from "@cs571/f23-api-middleware";

export class CS571DbConnector {

    public static BadgerId: Model;

    private config: CS571Config<BadgerAuthPublicConfig, BadgerAuthSecretConfig>;

    public constructor(config: CS571Config<BadgerAuthPublicConfig, BadgerAuthSecretConfig>) {
        this.config = config;
    }

    public async init() {
        const sequelize = new Sequelize(
            'badgerauth_dev',
            this.config.SECRET_CONFIG.SQL_CONN_USER,
            this.config.SECRET_CONFIG.SQL_CONN_PASS,
            {
                host: this.config.SECRET_CONFIG.SQL_CONN_ADDR,
                port: this.config.SECRET_CONFIG.SQL_CONN_PORT,
                dialect: 'mysql'
            }
        );
        await sequelize.authenticate();
        const BID = await sequelize.define("BadgerId", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            bid: {
                type: DataTypes.STRING(64),
                
                unique: true,
                allowNull: false
            },
            iat: {
                type: DataTypes.TIME,
                allowNull: false
            },
            eat: {
                type: DataTypes.TIME,
                allowNull: true
            }
        });
        await sequelize.sync()
        await BID.create({
            email: 'ctnelson2@wisc.edu',
            bid: 'bid_jdjddd',
            iat: new Date()
        })
        await sequelize.sync()
        console.log('BadgerId table created successfully!');
    }
}
