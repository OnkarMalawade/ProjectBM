import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'freelance_platform',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true, // Only for Dev (Migration recommended for Prod)
};
