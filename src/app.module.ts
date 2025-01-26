import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logger/logger.module';
import { RequestIdMiddleware } from './request-id.middleware';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';

@Module({
  imports: [LoggerModule, ConfigModule.forRoot({ isGlobal: true }), DbModule, AuthModule, BookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
