import { forwardRef, Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { AppModule } from '@/app.module';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [SessionService],
  exports: [SessionService]
})
export class SessionModule {
}
