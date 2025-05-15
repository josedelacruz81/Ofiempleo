import { Pool } from "pg";

let conn:any


if(!conn){

  conn = new Pool({
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    port: 5432,
    
  });

}

export { conn }
