
import { DataTypes, Sequelize, ModelStatic } from "sequelize";
import BadgerAuthSecretConfig from "../model/configs/badgerauth-secret-config";
import BadgerAuthPublicConfig from "../model/configs/badgerauth-public-config";
import { CS571Config } from "@cs571/f23-api-middleware";
import { BadgerId } from "../model/badger-id";

export class CS571DbConnector {

    private badgerIdTable!: ModelStatic<any>;

    private cachedIds: string[]
    private readonly sequelize: Sequelize
    private readonly config: CS571Config<BadgerAuthPublicConfig, BadgerAuthSecretConfig>;

    public constructor(config: CS571Config<BadgerAuthPublicConfig, BadgerAuthSecretConfig>) {
        this.cachedIds = [];
        this.config = config;
        this.sequelize = new Sequelize(
            'badgerauth_dev',
            this.config.SECRET_CONFIG.SQL_CONN_USER,
            this.config.SECRET_CONFIG.SQL_CONN_PASS,
            {
                host: this.config.SECRET_CONFIG.SQL_CONN_ADDR,
                port: this.config.SECRET_CONFIG.SQL_CONN_PORT,
                dialect: 'mysql'
            }
        );
    }

    public async init() {
        await this.sequelize.authenticate();
        this.badgerIdTable = await this.sequelize.define("BadgerId", {
            bid: {
                type: DataTypes.STRING(68), // bid_ + 64 chars
                primaryKey: true,
                unique: true,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(255),
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
        await this.sequelize.sync()
        await this.syncCache();
    }

    public async createBadgerId(bid: BadgerId): Promise<void> {
        await this.badgerIdTable.create({
            email: bid.email,
            bid: bid.bid,
            iat: bid.iat,
            eat: bid.eat
        })
        await this.sequelize.sync()
        await this.syncCache();
    }

    public async revokeBadgerId(email: string, bid: string): Promise<boolean> {
        const foundBid = await this.badgerIdTable.findOne({ where: { email, bid }});
        if (foundBid) {
            await this.badgerIdTable.destroy({where: { email, bid }});
            await this.syncCache();
            return true;
        } else {
            return false;
        }
    }

    public isValidBID(bid: string): boolean {
        return this.cachedIds.includes(bid);
    }

    public async getAllBadgerIds(): Promise<BadgerId[]> {
        return await this.badgerIdTable.findAll();
    }

    private async syncCache(): Promise<void> {
        this.cachedIds = (await this.badgerIdTable.findAll()).map(bid => bid.bid);
    }
}
