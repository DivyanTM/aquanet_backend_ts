import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER as string,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
  options: {
    trustServerCertificate: true
  }
};

export const getConnection = async () => {
  try {
    const pool = await sql.connect(config);
    // console.log("connected to database");
    return pool;
  } catch (err) {
    console.error('DB Connection Failed:', err);
    throw err;
  }
};
