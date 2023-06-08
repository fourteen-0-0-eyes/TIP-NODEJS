import {ConnectionOptions} from "typeorm";
import {Address, Order, OrderItem, Contract, Profile, User,} from "../entities";


export function getConnectionOptions(): ConnectionOptions {
    return {
        type: "postgres",
        host: process.env.POSTGRES_HOST || "localhost",
        port: Number(process.env.POSTGRES_PORT) || 5432,
        username: process.env.POSTGRES_USER || "pguser",
        password: process.env.POSTGRES_PASSWORD || "pgpass",
        database: process.env.POSTGRES_DB || "mogilevoblgas",
        entities: [
            User,
            Contract,
            Order,
            OrderItem,
            Address,
            Profile
        ],
        synchronize: true,
    };
}

export default getConnectionOptions();
