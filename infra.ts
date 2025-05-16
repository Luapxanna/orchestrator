import { SQLDatabase } from "encore.dev/storage/sqldb";
export const db = new SQLDatabase("mydb", {
    migrations: "./migrations",
});