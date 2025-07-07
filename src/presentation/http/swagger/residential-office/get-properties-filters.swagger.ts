import { ApiQuery } from "@nestjs/swagger";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { PropertyPostTag } from "src/domain/enums/property-post-tag.enum";
import { PropertyStatus } from "src/domain/enums/property-status.enum";

export const SearchPropertiesFiltersSwagger = [
  ApiQuery({ name: 'listing_type', enum: ListingType, required: false }),
  ApiQuery({ name: 'regionId', type: Number, required: false }),
  ApiQuery({ name: 'cityId', type: Number, required: false }),
  ApiQuery({ name: 'status', enum: PropertyStatus, required: false }),
  ApiQuery({ name: 'tag', enum: PropertyPostTag, required: false }),
];

export const SearchPropertiesTitleSwagger = [
  ApiQuery({
    name: 'title',
    required: true,
    description: 'عنوان العقار الذي ترغب بالبحث عنه',
    type: String,
    example: 'شقة للبيع',
  }),
];