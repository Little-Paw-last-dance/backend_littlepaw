import dotenv from 'dotenv';

dotenv.config();


const mysqlConfig = {
  HOST: process.env.MYSQL_HOST || 'localhost',
  PORT: process.env.MYSQL_PORT || '3306',
  USER: process.env.MYSQL_USER || '',
  PASSWORD: process.env.MYSQL_PASSWORD || '',
  DB: process.env.MYSQL_DATABASE || '',
};

export default mysqlConfig;

