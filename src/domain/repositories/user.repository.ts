import { User } from '../entities/user.entity';
import { NotificationSender } from '../enums/notification-sender.enum';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface UserRepositoryInterface {
    findById(userId: number); 
    findUsersByRoleId(roleId: number);
    findAll();
    findByEmailOrPhone(email?: string, phone?: string);
    findByEmail(email: string): Promise<User | null>;
    findByPhone(phone: string): Promise<User | null>;
    save(user: User): Promise<User>;
    updatePassword(userId: number, hashedPassword: string): Promise<void>;
    update(userId: number,updateData: Partial<User>);
    deleteUserById(userId: number);
    findGlobalInfoById(id: number);
    findUserInfoById(id: number);  
    getTargetUsers(target: NotificationSender);
 }