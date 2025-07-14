import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";
import { Permission } from "./permissions.entity";

@Entity('role_permissions')
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, role => role.rolePermissions, { onDelete: 'CASCADE' })
  role: Role;

  @ManyToOne(() => Permission, permission => permission.rolePermissions, { onDelete: 'CASCADE' })
  permission: Permission;
}
