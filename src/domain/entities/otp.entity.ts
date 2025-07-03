import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export type OtpType = 'signup' | 'reset';

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn('uuid')             id: string;
  @Column({ length: 4 })                     code: string;
  @Column()                                  email: string;
  @Column({ type: 'enum', enum: ['signup','reset'] }) type: OtpType;
  @CreateDateColumn({ name: 'created_at' })   created_at: Date;
  @Column({ name: 'expires_at', type: 'timestamptz' }) expires_at: Date;
}
