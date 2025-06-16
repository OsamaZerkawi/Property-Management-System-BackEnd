import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Role } from "./role.entity";

@Entity('user_roles')   
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.userRoles, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Role, role => role.userRoles, { onDelete: 'CASCADE' })
  role: Role;

  @CreateDateColumn()
  created_at: Date; 

  @UpdateDateColumn()
  updated_at: Date;
}