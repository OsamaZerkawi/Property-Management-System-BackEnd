
export const TAG_REPOSITORY = 'TAG_REPOSITORY';

export interface TagRepositoryInterface {
    getAllTags();
    findTagsByIds(tags: number[]);
}