import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Permission } from "./permissions.entity";

@Entity('user_permissions') 
export class UserPermission {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.userPermissions, { onDelete: 'CASCADE'})
    user: User;

    @ManyToOne(() => Permission, permission => permission.userPermissions, {onDelete: 'CASCADE'})
    permission: Permission;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}