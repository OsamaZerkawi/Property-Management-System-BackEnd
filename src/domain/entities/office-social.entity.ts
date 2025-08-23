 
import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
    Unique
  } from 'typeorm';
  import { Office } from './offices.entity';
import { SocialPlatform } from './social_platforms.entity';
 

@Entity('office_socials')
export class OfficeSocial {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Office, (office) => office.socials, {
    onDelete: 'CASCADE',
  })
  office: Office;

  @ManyToOne(() => SocialPlatform, (platform) => platform.offices, {
    eager: true,
    onDelete: 'CASCADE',
  })
  platform: SocialPlatform;

  @Column({ type: 'varchar', length: 512, nullable: true })
  link: string | null;
}

  