import { BadRequestException, Controller, DefaultValuePipe, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Query, Req } from "@nestjs/common";
import { Request } from "express";
import { AddPropertyToFavoriteUseCase } from "src/application/use-cases/favorite/add-property-to-favorite.use-case";
import { GetFavoritePropertiesUseCase } from "src/application/use-cases/favorite/get-favorite-properties.use-case";
import { RemovePropertyFromFavoriteUseCase } from "src/application/use-cases/favorite/remove-property-from-favorite.use-case";
import { PropertyType } from "src/domain/enums/property-type.enum";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { errorResponse, successPaginatedResponse, successResponse } from "src/shared/helpers/response.helper";
import { GetFavoritesSwaggerDoc } from "../swagger/property-favorite/get-own-favorites.swagger";
import { AddFavoriteSwaggerDoc } from "../swagger/property-favorite/add-to-favorite.swagger";
import { RemoveFavoriteSwaggerDoc } from "../swagger/property-favorite/remove-from-favorites.swagger";

@Controller('property-favorite')
export class PropertyFavoriteController {
    constructor(
        private readonly addPropertyToFavoriteUseCase: AddPropertyToFavoriteUseCase,
        private readonly removePropertyFromFavoriteUseCase: RemovePropertyFromFavoriteUseCase,
        private readonly getFavoritePropertiesUseCase: GetFavoritePropertiesUseCase,
    ){}

    @Get()
    @GetFavoritesSwaggerDoc()
    @HttpCode(HttpStatus.OK)
    async getFavorites(
        @Query('page',new DefaultValuePipe(1),ParseIntPipe) page: number,
        @Query('items',new DefaultValuePipe(10),ParseIntPipe) items: number,
        @Query('type') type: PropertyType, 
        @CurrentUser() user,
        @Req() request: Request,
    ){
        const userId = user.sub;
        const baseUrl = `${request.protocol}://${request.get('host')}`;

        if (!type || (type !== PropertyType.RESIDENTIAL && type !== PropertyType.TOURISTIC)) {
          throw new BadRequestException(
              errorResponse('يجب تحديد نوع العقار (سكني أو سياحي)', 400)
          );
        }

        const { favorites, total } = await this.getFavoritePropertiesUseCase.execute(userId,type,page,items,baseUrl);

        return successPaginatedResponse(favorites,total,page,items,'تم إرجاع جميع العقارات المفضلة لك',200);

    }

    @Get(':propertyId/add')
    @AddFavoriteSwaggerDoc()
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
    @RemoveFavoriteSwaggerDoc()
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