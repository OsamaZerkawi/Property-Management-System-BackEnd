import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { RefreshToken } from "./refresh-token.entity";

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  PROPERTY_MANAGER = 'property_manager'
}

@Entity({name: 'users'})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({unique:true})
  phone: string;

  @Column({unique: true,nullable:true})
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER
  })
  role: Role;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  stripe_customer_id: string;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshToken: RefreshToken;

}