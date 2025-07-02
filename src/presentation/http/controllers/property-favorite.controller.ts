import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { AddPropertyToFavoriteUseCase } from "src/application/use-cases/property/add-property-to-favorite.use-case";
import { RemovePropertyFromFavoriteUseCase } from "src/application/use-cases/property/remove-property-from-favorite.use-case";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { successResponse } from "src/shared/helpers/response.helper";

@Controller('property-favorite')
export class PropertyFavoriteController {
    constructor(
        private readonly addPropertyToFavoriteUseCase: AddPropertyToFavoriteUseCase,
        private readonly removePropertyFromFavoriteUseCase: RemovePropertyFromFavoriteUseCase,
    ){}

    @Get(':propertyId/add')
    @HttpCode(HttpStatus.CREATED)
    async addPropertyToFavorite(
        @Param('propertyId') propertyId: number,
        @CurrentUser() user,
    ){
        const userId = user.sub;
        await this.addPropertyToFavoriteUseCase.execute(userId,propertyId);

        return successResponse([],'تم اضافة العقار إلى المفضلة',201);
    }

    @Delete(':propertyId/remove')
    @HttpCode(HttpStatus.OK)
    async removePropertyFromFavorite(
        @Param('propertyId') propertyId: number,
        @CurrentUser() user,        
    ){
        const userId = user.sub;

        await this.removePropertyFromFavoriteUseCase.execute(userId,propertyId);

        return successResponse([],'تم إزالة هذا العقار من المفضلة ',200);
    }
}