import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth.module';
import { Faqs } from 'src/domain/entities/faqs.entity';
import { SUPPORT_REPOSITORY } from 'src/domain/repositories/support.repository';
import { SupportRepository } from 'src/infrastructure/repositories/support.repository';
import { SupportController } from '../controllers/support.controller';
import { CreateFaqUseCase } from 'src/application/use-cases/support/create-faq.use-case';
import { UpdateFaqUseCase } from 'src/application/use-cases/support/update-faq.use-case';
import { DeleteFaqUseCase } from 'src/application/use-cases/support/delete-faq.use-case';
import { FindAllFaqsUseCase } from 'src/application/use-cases/support/get-all-faqs.use-case';
import { COMPLAINT_REPOSITORY } from 'src/domain/repositories/complaint.repository';
import { ComplaintRepository } from 'src/infrastructure/repositories/complaint.repository';
import { ServiceFeedback } from 'src/domain/entities/service-feedback.entity';
import { OfficeFeedback } from 'src/domain/entities/office-feedback.entity';
import { ServiceProvider } from 'src/domain/entities/service-provider.entity';
import { Office } from 'src/domain/entities/offices.entity';
import { User } from 'src/domain/entities/user.entity';
import { ComplaintController } from '../controllers/complaint.controller';
import { GetPendingComplaintsUseCase } from 'src/application/use-cases/complaint/get-pending.complaints.use-case';
import { RespondToComplaintUseCase } from 'src/application/use-cases/complaint/respond-to-complaint.use-case';
import { GetOfficeAndServicesHasComplaintUseCase } from 'src/application/use-cases/complaint/get-office-and-services-has-complaint.use-case';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Faqs,
      ServiceFeedback,
      OfficeFeedback,
      ServiceProvider,
      Office,
      User,
    ]),
  ],
  controllers: [SupportController, ComplaintController],
  providers: [
    CreateFaqUseCase,
    UpdateFaqUseCase,
    DeleteFaqUseCase,
    FindAllFaqsUseCase,
    GetPendingComplaintsUseCase,
    RespondToComplaintUseCase,
    GetOfficeAndServicesHasComplaintUseCase,
    {
      provide: SUPPORT_REPOSITORY,
      useClass: SupportRepository,
    },
    {
      provide: COMPLAINT_REPOSITORY,
      useClass: ComplaintRepository,
    },
  ],
})
export class SupportModule {}
