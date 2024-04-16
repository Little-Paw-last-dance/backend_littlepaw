import "reflect-metadata"
import { DataSource } from "typeorm"
import User from "../entity/User"
import mysqlConfig from '../config/mysqlConfig';
import Role from "../entity/Roles";

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
        User,
        Role
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