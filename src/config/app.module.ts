import { Module } from '@nestjs/common';
import { AppController } from '../presentation/http/controllers/app.controller';
import { AppService } from '../shared/common/app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
