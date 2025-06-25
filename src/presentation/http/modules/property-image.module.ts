import { Module } from "@nestjs/common";
import { PropertyImageController } from "../controllers/property-image.controller";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Property } from "src/domain/entities/property.entity";
import { jwtConfig } from "src/infrastructure/config/jwt.config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UploadPropertyImagesUseCase } from "src/application/use-cases/property/upload-property-image.use-case";
import { Image } from "src/domain/entities/image.entity";
import { IMAGE_REPOSITORY } from "src/domain/repositories/image.repository";
import { ImageRepository } from "src/infrastructure/repositories/image.repostiory";
import { GetPropertyImagesUseCase } from "src/application/use-cases/property/get-property-images.use-case";
import { UpdatePropertyImageUseCase } from "src/application/use-cases/property/update-property-image.use-case";
import { DeletePropertyImageUseCase } from "src/application/use-cases/property/delete-property-image.use-case";
import { PropertyAccessService } from "src/application/services/propertyAccess.service";
import { PROPERTY_REPOSITORY } from "src/domain/repositories/property.repository";
import { PropertyRepository } from "src/infrastructure/repositories/property.repository";
import { Office } from "src/domain/entities/offices.entity";
import { PropertyFeedback } from "src/domain/entities/property-feedback.entity";

@Module({
    imports:[
        AuthModule,
        TypeOrmModule.forFeature([Image,Property,Office,PropertyFeedback]),
    ],
    controllers:[PropertyImageController],
    providers:[
        {
            provide:IMAGE_REPOSITORY,
            useClass:ImageRepository
        },
        {
            provide: PROPERTY_REPOSITORY,
            useClass:PropertyRepository
        },
        UploadPropertyImagesUseCase,
        GetPropertyImagesUseCase,
        UpdatePropertyImageUseCase,
        DeletePropertyImageUseCase,
        PropertyAccessService,
    ]
})
export class PropertyImageModule {}