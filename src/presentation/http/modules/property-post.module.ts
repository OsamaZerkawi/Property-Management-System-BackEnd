import { Module } from '@nestjs/common';
import { PROPERTY_POST_REPOSITORY } from 'src/domain/repositories/property-post.repository';
import { PropertyPostRepository } from 'src/infrastructure/repositories/property-post.repository';
import { AuthModule } from './auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyPost } from 'src/domain/entities/property-posts.entitiy';
import { Property } from 'src/domain/entities/property.entity';
import { AttachTagsToPostUseCase } from 'src/application/use-cases/property-post/attach-tags-to-post.use-case';
import { CreatePropertyPostUseCase } from 'src/application/use-cases/property-post/create-property-post.use-case';
import { AdminPartnersManagementModule } from './admin-partners-management.module';
import { ADMIN_CITY_REPOSITORY } from 'src/domain/repositories/admin-city.repository';
import { AdminCityRepository } from 'src/infrastructure/repositories/admin-city.repository';
import { AdminCity } from 'src/domain/entities/admin-city.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([PropertyPost, Property,AdminCity]),
  ],
  controllers: [],
  providers: [
    {
      provide: PROPERTY_POST_REPOSITORY,
      useClass: PropertyPostRepository,
    },
    {
      provide: ADMIN_CITY_REPOSITORY,
      useClass: AdminCityRepository,
    },
    AttachTagsToPostUseCase,
    CreatePropertyPostUseCase,
  ],
  exports: [
    PROPERTY_POST_REPOSITORY,
    AttachTagsToPostUseCase,
    CreatePropertyPostUseCase,
  ],
})
export class PropertyPostModule {}
