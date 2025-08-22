import { Module } from '@nestjs/common';
import { AppController } from '../presentation/http/controllers/app.controller';
import { AppService } from '../shared/common/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrmConfig from 'src/infrastructure/config/typeorm.config';
import { AuthController } from 'src/presentation/http/controllers/auth.controller';
import { AuthModule } from 'src/presentation/http/modules/auth.module';
import { PropertyImageModule } from 'src/presentation/http/modules/property-image.module';
import { ResidentialOfficeModule } from 'src/presentation/http/modules/residential-office.module';
import { CityModule } from 'src/presentation/http/modules/city.module';
import { RegionModule } from 'src/presentation/http/modules/region.module';
import { PropertyPostModule } from 'src/presentation/http/modules/property-post.module';
import { OfficeModule } from 'src/presentation/http/modules/office.module'; 
//import { SentryModule } from "@sentry/nestjs/setup";
import { ServicePriceModule } from 'src/presentation/http/modules/service-price.module'; 
import { UserPostModule } from 'src/presentation/http/modules/user-post.module';
import { UserPostSuggestionModule } from 'src/presentation/http/modules/user-post-suggestion.module';
import { PropertyReservationModule } from 'src/presentation/http/modules/proeprty-reservation.module';
import { ServiceProviderModule } from 'src/presentation/http/modules/service-provider.module';
import { RoleModule } from 'src/presentation/http/modules/role.module';
import { PermissionModule } from 'src/presentation/http/modules/permission.module';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from 'src/shared/guards/permission.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { PropertyModule } from 'src/presentation/http/modules/property.module';
import { UserReservationModule } from 'src/presentation/http/modules/user-reservation.module';
import { UserInvoiceModule } from 'src/presentation/http/modules/user-invoice.module';
import { MapExploreModule } from 'src/presentation/http/modules/map-explore.module';
import { MobileAuthModule } from 'src/presentation/http/modules/mobile_auth.module';
import { NotificationModule } from 'src/presentation/http/modules/notification.module';
import { BullModule } from '@nestjs/bull';
import { AdvertisementModule } from 'src/presentation/http/modules/advertisement.module';
import { AdminModule } from 'src/presentation/http/modules/admin.module';
import { TourismModule } from 'src/presentation/http/modules/tourism.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminPartnersManagementModule } from 'src/presentation/http/modules/admin-partners-management.module';
import { RentalContractModule } from 'src/presentation/http/modules/rental-contract.module';
import { UserModule } from 'src/presentation/http/modules/user.module';
import { ReminderScheduler } from 'src/infrastructure/schedulers/reminder.scheduler';
import { ReminderModule } from 'src/presentation/http/modules/reminder.module';
import { StatsModule } from 'src/presentation/http/modules/stats.module';
import { AdminUserPostModule } from 'src/presentation/http/modules/admin-user-post.module';
import { SupportModule } from 'src/presentation/http/modules/support.module';
import { StripePaymentModule } from 'src/presentation/http/modules/stripe-payment.module';
import { ProfitsSubscriber } from 'src/infrastructure/subscribers/profits.subscriber';
 
@Module({
  imports: [
    SupportModule,
    StatsModule,
    ReminderModule,
    AdminPartnersManagementModule,
    ScheduleModule.forRoot(),
    AdminModule,
    AdvertisementModule,
    NotificationModule,
    UserPostModule,
    AdminUserPostModule,
    RoleModule,
    ResidentialOfficeModule,
    PermissionModule,
    PropertyModule,
    ServiceProviderModule,
    UserPostSuggestionModule,
    OfficeModule,
    AuthModule,
    CityModule,
    PropertyPostModule,
    RegionModule,
    PropertyImageModule,
    PropertyReservationModule,
    UserReservationModule,
    UserInvoiceModule,
    MapExploreModule,
    PropertyImageModule, 
    ResidentialOfficeModule, 
    ServicePriceModule,
    MobileAuthModule,
    TourismModule,
    RentalContractModule,
    //SentryModule.forRoot(), 
    PropertyReservationModule, 
    UserModule,
    StripePaymentModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', 
     }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => OrmConfig(configService),
      inject: [ConfigService],
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ProfitsSubscriber,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // authenticate first, sets request.user
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
