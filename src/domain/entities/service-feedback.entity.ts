import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { ServiceProvider } from "./service-provider.entity";
import { User } from "./user.entity";

@Entity('service_feedbacks')
@Index(['user', 'serviceProvider'], { unique: true })
@Index(['serviceProvider'])
@Index(['rate'])
export class ServiceFeedback{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'int',nullable: true})
    rate: number;

    @Column({type:'text',nullable: true})
    complait: string;

    @ManyToOne(() => ServiceProvider, (sp) => sp.feedbacks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'service_provider_id' })
    serviceProvider: ServiceProvider;
  
    @ManyToOne(() => User, (user) => user.feedbacks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;    

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}