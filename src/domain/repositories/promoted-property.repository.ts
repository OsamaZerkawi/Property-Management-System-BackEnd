
export const PROMOTED_PROPERTY_REPOISTORY = 'PROMOTED_PROPERTY_REPOISTORY';

export interface PromotedPropertyRepositoryInterface {
    getAllPromotedProperties(page: number,items: number,userId: number);
}