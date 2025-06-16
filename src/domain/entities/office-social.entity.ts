 
import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn
  } from 'typeorm';
  import { Office } from './offices.entity';
  
  @Entity('office_socials')
  export class OfficeSocial {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 50 })
    platform: string;      // e.g. 'facebook', 'whatsapp', 'instagram'
  
    @Column({ type: 'varchar', length: 255 })
    link: string;
  
    @ManyToOne(() => Office, office => office.socials, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'office_id' })
    office: Office;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  