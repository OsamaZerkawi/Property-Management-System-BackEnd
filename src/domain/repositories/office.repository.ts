
export const OFFICE_REPOSITORY = 'OFFICE_REPOSITORY';

export interface OfficeRepositoryInterface { 
    findOneByUserId (userId: number);
}