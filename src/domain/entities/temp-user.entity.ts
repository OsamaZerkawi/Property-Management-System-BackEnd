import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('temp_users')
export class TempUser {
  @PrimaryGeneratedColumn('uuid')            id: string;
  @Column()                                 first_name: string;
  @Column()                                 last_name:  string;
  @Column({ nullable: true })               phone: string;
  @Column({ type: 'text', nullable: true }) photo: string;
  @Column({ unique: true })                 email: string;
  @Column()                                 password: string;
  @CreateDateColumn({ name: 'created_at' }) created_at: Date;
}