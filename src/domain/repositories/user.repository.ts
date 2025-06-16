
export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface UserRepositoryInterface {
    findById(userId: number);
    findByPhone(phone: string);

}