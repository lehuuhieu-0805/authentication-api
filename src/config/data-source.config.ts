import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mssql',
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT),
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: ['dist/components/**/*.entity{.js,.ts}'],
  migrations: ['dist/database/migrations/*.js'],
  extra: {
    options: {
      encrypt: false,
    },
  },
};

const dataSource = new DataSource(dataSourceOptions);

dataSource
  .initialize()
  .then(() => console.log('Data Source has been initialized!'))
  .catch((error) =>
    console.error('Error during Data Source initialization', error),
  );

export default dataSource;
