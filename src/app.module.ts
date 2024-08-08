import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '45.127.134.182',
      port: 5432,
      username: 'postgres',
      password: '177013',
      database: 'local-dev',
      entities: [User],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// postgres://postgres:177013@45.127.134.182:5432/postgres?schema=public
