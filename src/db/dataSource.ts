import "reflect-metadata"
import { DataSource } from "typeorm"
import mysqlConfig from '../config/mysqlConfig';
import logger from "../config/logger";

const typeORM = new DataSource({
    type: "mysql",
    host: mysqlConfig.HOST,
    port: parseInt(mysqlConfig.PORT),
    username: mysqlConfig.USER,
    password: mysqlConfig.PASSWORD,
    database: mysqlConfig.DB,
    synchronize: false,
    logging: false,
    entities: [
        __dirname + "/../entity/*.ts",
        __dirname + "/../entity/*.js"
    ],
    migrations: [],
    subscribers: [],
})

typeORM.initialize().then(() => {
    logger.info(`Connection to Database "${mysqlConfig.DB}" on "${mysqlConfig.HOST}:${mysqlConfig.PORT}" with user "${mysqlConfig.USER}" established successfully`);
}).catch((error) => {
    logger.error('Error establishing connection to database: %o', error);
});

export default typeORM;