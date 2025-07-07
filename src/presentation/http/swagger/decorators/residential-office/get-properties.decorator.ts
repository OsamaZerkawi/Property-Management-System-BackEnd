import { applyDecorators } from '@nestjs/common';
import { GetOfficePropertiesAuth, GetOfficePropertiesSuccessResponse, GetOfficePropertiesUnauthorized } from '../../residential-office/get-properties.swagger';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { SearchPropertiesFiltersSwagger, SearchPropertiesTitleSwagger } from '../../residential-office/get-properties-filters.swagger';

export function GetOfficePropertiesSwaggerDoc() {
  return applyDecorators(
    GetOfficePropertiesAuth,
    ApiBearerAuth(), 
    GetOfficePropertiesSuccessResponse,
    GetOfficePropertiesUnauthorized
  );
}

export function SearchPropertiesSwaggerDoc() {
  return applyDecorators(
    GetOfficePropertiesAuth,
    ApiBearerAuth(), 
    ...SearchPropertiesFiltersSwagger,
    GetOfficePropertiesSuccessResponse,
    GetOfficePropertiesUnauthorized
  );
}

export function SearchTitlePropertiesSwaggerDoc() {
  return applyDecorators(
    GetOfficePropertiesAuth,
    ...SearchPropertiesTitleSwagger,
    GetOfficePropertiesSuccessResponse,
    GetOfficePropertiesUnauthorized
  );
}

export function GetOfficePropertySwaggerDoc() {
  return applyDecorators(
    GetOfficePropertiesAuth,
    ApiBearerAuth(), 
    ApiParam({
      name: 'propertyId',
      type: Number,
      description: 'معرف العقار',
      example: 12,
    }),
    GetOfficePropertiesSuccessResponse,
    GetOfficePropertiesUnauthorized
  );
}
