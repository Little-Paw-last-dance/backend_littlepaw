import "reflect-metadata"
import { DataSource } from "typeorm"
import mysqlConfig from '../config/mysqlConfig';

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
    console.log(`Connection to Database "${mysqlConfig.DB}" on "${mysqlConfig.HOST}:${mysqlConfig.PORT}" with user "${mysqlConfig.USER}" established successfully`);
}).catch((error) => {
    console.log("Error connecting to database", error)
});

export default typeORM;