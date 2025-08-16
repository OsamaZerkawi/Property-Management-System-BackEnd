import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth.module";
import { Faqs } from "src/domain/entities/faqs.entity";
import { SUPPORT_REPOSITORY } from "src/domain/repositories/support.repository";
import { SupportRepository } from "src/infrastructure/repositories/support.repository";
import { SupportController } from "../controllers/support.controller";
import { CreateFaqUseCase } from "src/application/use-cases/support/create-faq.use-case";
import { UpdateFaqUseCase } from "src/application/use-cases/support/update-faq.use-case";
import { DeleteFaqUseCase } from "src/application/use-cases/support/delete-faq.use-case";
import { FindAllFaqsUseCase } from "src/application/use-cases/support/get-all-faqs.use-case";

@Module({
    imports:[
        AuthModule,
        TypeOrmModule.forFeature([Faqs])
    ],
    controllers:[SupportController],
    providers:[
        CreateFaqUseCase,
        UpdateFaqUseCase,
        DeleteFaqUseCase,
        FindAllFaqsUseCase,
        {
            provide: SUPPORT_REPOSITORY,
            useClass: SupportRepository
        }
    ],
})
export class SupportModule {}