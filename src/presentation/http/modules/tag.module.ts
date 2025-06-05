import { Module } from "@nestjs/common";
import { TagController } from "../controllers/tag.controller";
import { TAG_REPOSITORY } from "src/domain/repositories/tag.repository";
import { TagRepository } from "src/infrastructure/repositories/tag.repository";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { jwtConfig } from "src/infrastructure/config/jwt.config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Tag } from "src/domain/entities/tag.entity";
import { GetAllTagsUseCase } from "src/application/use-cases/tag/get-all-tags.use-case";
import { FindTagsUseCase } from "src/application/use-cases/tag/find-tags.use-case";

@Module({
    imports:[
       AuthModule,
       TypeOrmModule.forFeature([Tag]),
       JwtModule.registerAsync({
               imports: [ConfigModule],
               inject: [ConfigService],
               useFactory: jwtConfig
       }),
       
    ],
    providers:[
        GetAllTagsUseCase,
        FindTagsUseCase,
        {
            provide:TAG_REPOSITORY,
            useClass:TagRepository
        }
    ],
    controllers:[TagController],
    exports: [
        TAG_REPOSITORY,
        FindTagsUseCase
    ]
})
export class TagModule{}