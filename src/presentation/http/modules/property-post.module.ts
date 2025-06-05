import { Module } from "@nestjs/common";
import { PROPERTY_POST_REPOSITORY } from "src/domain/repositories/property-post.repository";
import { PropertyPostRepository } from "src/infrastructure/repositories/property-post.repository";
import { AuthModule } from "./auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PropertyPost } from "src/domain/entities/property-posts.entitiy";
import { Property } from "src/domain/entities/property.entity";
import { PropertyPostTag } from "src/domain/entities/property-post-tag.entity";
import { Tag } from "src/domain/entities/tag.entity";
import { AttachTagsToPostUseCase } from "src/application/use-cases/property-post/attach-tags-to-post.use-case";
import { CreatePropertyPostUseCase } from "src/application/use-cases/property-post/create-property-post.use-case";

@Module({
    imports:[
        AuthModule,
        TypeOrmModule.forFeature([PropertyPost,Property,PropertyPostTag,Tag])
    ],
    controllers:[],
    providers:[
        {
            provide:PROPERTY_POST_REPOSITORY,
            useClass:PropertyPostRepository
        },
        AttachTagsToPostUseCase,
        CreatePropertyPostUseCase
    ],
    exports: [
        PROPERTY_POST_REPOSITORY,
        AttachTagsToPostUseCase,
        CreatePropertyPostUseCase
    ]
})
export class PropertyPostModule {}