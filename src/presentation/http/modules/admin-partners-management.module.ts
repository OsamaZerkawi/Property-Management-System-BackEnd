import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { AdminPartnersManagementController } from '../controllers/admin-partners-management.controller';
import { ADMIN_CITY_REPOSITORY } from 'src/domain/repositories/admin-city.repository';
import { AdminCityRepository } from 'src/infrastructure/repositories/admin-city.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Office } from 'src/domain/entities/offices.entity';
import { User } from 'src/domain/entities/user.entity';
import { AdminCity } from 'src/domain/entities/admin-city.entity';
import { ServiceProvider } from 'src/domain/entities/service-provider.entity';
import { OfficeModule } from './office.module';
import { GetOfficesByAdminCityUseCase } from 'src/application/use-cases/office/get-offices-by-admin-city.use-case';
import { City } from 'src/domain/entities/city.entity';
import { Region } from 'src/domain/entities/region.entity';
import { GetServiceProvidersByAdminCityUseCase } from 'src/application/use-cases/service-provider/get-service-provider-by-admin-city.use-case';
import { ServiceProviderModule } from './service-provider.module';
import { OfficeFeedback } from 'src/domain/entities/office-feedback.entity';
import { ServiceProviderFeedbackDto } from 'src/application/dtos/service-provider/service-provider-feedback.dto';
import { ServiceFeedback } from 'src/domain/entities/service-feedback.entity';
import { GetServiceProviderDetailsUseCase } from 'src/application/use-cases/service-provider/get-service-provider-details.use-case';
import { JOIN_REQUEST_REPOSITORY } from 'src/domain/repositories/join-requests.repository';
import { JoinRequestRepository } from 'src/infrastructure/repositories/join-requests.repository';
import { JoinRequest } from 'src/domain/entities/join-request.entity';
import { RespondToJoinRequestUseCase } from 'src/application/use-cases/join-requests/respond-to-join-requests.use-case';
import { MailService } from 'src/application/services/mail.service';
import { Role } from 'src/domain/entities/role.entity';
import { UserRole } from 'src/domain/entities/user-role.entity';
import { RoleModule } from './role.module';
import { GetJoinRequetsUseCase } from 'src/application/use-cases/join-requests/get-join-requets.use-case';
import { PropertyPostModule } from './property-post.module';
import { PropertyPost } from 'src/domain/entities/property-posts.entitiy';
import { GetPendingPropertyPostsUseCase } from 'src/application/use-cases/property-post/get-pending-property-post.use-case';
import { RespondToPropertyPostUseCase } from 'src/application/use-cases/property-post/respond-to-property-post.use-case';
import { Notification } from 'src/domain/entities/notification.entity';
import { NotificationModule } from './notification.module';
import { SubscriberController } from '../controllers/subscribers.controller';
import { GetPopularStatsUseCase } from 'src/application/use-cases/stats/get-popular-stats.use-case';
import { StatsModule } from './stats.module';
import { RegisterSubscriberUseCase } from 'src/application/use-cases/auth/register-subscriber.use-case';
import { GetOfficeDetailsMobileUseCase } from 'src/application/use-cases/office/show-office-details-mobile';
import { Residential } from 'src/domain/entities/residential.entity';
import { Touristic } from 'src/domain/entities/touristic.entity';
import { Property } from 'src/domain/entities/property.entity';
import { GetPropertiesForOfficeUseCase } from 'src/application/use-cases/office/get-properties-for-office.use.case';
import { PropertyModule } from './property.module';
import { TourismModule } from './tourism.module';

@Module({
  imports: [
    PropertyModule,
    TourismModule,
    StatsModule,
    NotificationModule,
    PropertyPostModule,
    RoleModule,
    AuthModule,
    OfficeModule,
    ServiceProviderModule,
    TypeOrmModule.forFeature([
      Office,
      User,
      AdminCity,
      ServiceProvider,
      City,
      Region,
      OfficeFeedback,
      ServiceFeedback,
      JoinRequest,
      User,
      Role,
      UserRole,
      PropertyPost,
      AdminCity,
      Region,
      City,
      Notification,
      Residential,
      Touristic,
      Property
    ]),
  ],
  controllers: [AdminPartnersManagementController, SubscriberController],
  providers: [
    GetOfficesByAdminCityUseCase,
    GetServiceProvidersByAdminCityUseCase,
    GetServiceProviderDetailsUseCase,
    RespondToJoinRequestUseCase,
    GetJoinRequetsUseCase,
    GetPendingPropertyPostsUseCase,
    RespondToPropertyPostUseCase,
    GetPopularStatsUseCase,
    RegisterSubscriberUseCase,
    GetOfficeDetailsMobileUseCase,
    GetPropertiesForOfficeUseCase,
    {
      provide: ADMIN_CITY_REPOSITORY,
      useClass: AdminCityRepository,
    },
    {
      provide: JOIN_REQUEST_REPOSITORY,
      useClass: JoinRequestRepository,
    },
    MailService,
  ],
  exports: [],
})
export class AdminPartnersManagementModule {}
