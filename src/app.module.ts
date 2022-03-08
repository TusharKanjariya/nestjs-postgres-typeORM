import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: [`.env.stage.${process.env.STAGE}`]
  }), TasksModule, TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const isProduction = config.get('STAGE') === 'prod';
      return {
        ssl: isProduction,
        extra: {
          ssl: isProduction ? { rejectUnauthorized: false } : null,
        },
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        autoLoadEntities: true,
        synchronize: true
      }
    }
  }), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

