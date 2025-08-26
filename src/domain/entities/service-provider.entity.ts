import { Collection, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Region } from "./region.entity";
import { ServiceFeedback } from "./service-feedback.entity";
import { ServiceProviderType } from "../enums/service-provider-type.enum";
import { ServiceProviderSocial } from "./service-providers-social.entity";

@Entity('service_providers')
@Index(['user', 'region'],{unique:true})
export class ServiceProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 ,nullable:true})
  name: string;

  @Column({ type: 'varchar', length: 255 ,nullable:true})
  logo: string;

  @Column({ type: 'text',nullable:true })
  details: string;

  @Column({ type: 'boolean', default: true })
  @Index()
  active: boolean;

  @Column({type:'enum',enum: ServiceProviderType})
  career: ServiceProviderType;

  @OneToOne(() => User, (user) => user.serviceProvider, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Index()
  user: User;

  @ManyToOne(() => Region, (region) => region.serviceProviders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'region_id' })
  @Index()
  region: Region;

  @OneToMany(() => ServiceFeedback, (feedback) => feedback.serviceProvider)
  feedbacks: ServiceFeedback[];

  @OneToMany(
    () => ServiceProviderSocial,
    (social) => social.serviceProvider,
    { cascade: true },
  )
  socials: ServiceProviderSocial[];

  @Column({nullable:true})
  opening_time: string;

  @Column({nullable:true})
  closing_time: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}