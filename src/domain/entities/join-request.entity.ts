import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AgentType } from "../enums/agent-type.enum";
import { createZstdDecompress } from "zlib";
import { UpdateAdminDto } from "src/application/dtos/auth/update-admin.dto";
import { AdminAgreement } from "../enums/admin-agreement.enum";

@Entity('join_requests')        
export class JoinRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'enum',enum: AgentType})
    agent_type: AgentType;

    @Column({ type: 'varchar', length: 100 })
    first_name: string;
  
    @Column({ type: 'varchar', length: 100 })
    last_name: string;

    @Column({type:'enum',enum:AdminAgreement,default: AdminAgreement.PENDING})
    admin_agreement: AdminAgreement;

    @Column({type: 'varchar',length:255})
    location: string;

    @Column({type:'varchar',length:255})
    proof_document: string;

    @Column({type: 'varchar',length:255})
    email: string;

    @CreateDateColumn()
    created_at: Date;

}