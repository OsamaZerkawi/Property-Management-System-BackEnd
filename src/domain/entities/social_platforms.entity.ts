import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OfficeSocial } from './office-social.entity';
 
@Entity('social_platforms')
export class SocialPlatform {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => OfficeSocial, (officeSocial) => officeSocial.platform)
  offices: OfficeSocial[];
}
