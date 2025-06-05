import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { GetAllTagsUseCase } from "src/application/use-cases/tag/get-all-tags.use-case";
import { successResponse } from "src/shared/helpers/response.helper";

@Controller('tag')
export class TagController {
    constructor(
        private readonly getAllTagsUseCase : GetAllTagsUseCase
    ){}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getTags(){
        const tags = await this.getAllTagsUseCase.execute();

        return successResponse(tags,'تم ارجاع جميع الكلمات المفتاحية ',200);
    }
}