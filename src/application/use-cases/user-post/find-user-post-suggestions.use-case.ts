import { Inject, NotFoundException } from "@nestjs/common";
import { ListingType } from "src/domain/enums/listing-type.enum";
import { USER_POST_REPOSITORY, UserPostRepositoryInterface } from "src/domain/repositories/user-post.repository";
import { errorResponse } from "src/shared/helpers/response.helper";

export class FindUserPostSuggestionsUseCase {
    constructor(
        @Inject(USER_POST_REPOSITORY)
        private readonly userPostRepo: UserPostRepositoryInterface, 
    ){}

    async execute(userId: number,userPostId: number,baseUrl: string) {
        const rows = await this.userPostRepo.findSuggestionsByUserPostId(userPostId,userId);
        
        if (!rows || rows.length === 0) {
          throw new NotFoundException(
            errorResponse('لا توجد اقتراحات لهذا الطلب',404)
          );
        }
        
        return rows.map(row => {
          const suggestion = {
            property_id: row.property_id,
            image: `${baseUrl}/uploads/properties/posts/images/${row.post_image}`,
            title: row.post_title,
            location: `${row.city_name} - ${row.region_name}`,
            price: row.listing_type === ListingType.SALE ? row.selling_price : row.rental_price,
          };
      
          if (row.listing_type === 'rent') {
            return {
              ...suggestion,
              rate: parseFloat(row.avg_rate) || 0,
            };
          }
      
          return suggestion;
        });
    }
}