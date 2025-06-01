import { Entity, PrimaryGeneratedColumn , Column, OneToOne, JoinColumn ,CreateDateColumn, Index} from "typeorm";
import { User } from "./user.entity";

@Entity({name : 'refresh-tokens'})
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      type: 'varchar',
      length : 512
    })
    refreshToken: string;

    @CreateDateColumn({ name: 'created_at'})
      createdAt: Date;

    @Column({type : 'timestamp'})
    expiredAt: Date;

    @Index()
    @OneToOne(() => User , (user) => user.refreshToken)
    @JoinColumn({name : 'user_id'})
    user: User;

}