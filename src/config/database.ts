import { DataSource } from "typeorm"
import dotenv from 'dotenv';
import { User } from "@Entity/User";
import { Product } from "@Entity/Product";

dotenv.config();

export const dataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    Product,
    User
  ],
  synchronize: true,
  logging: false
})





