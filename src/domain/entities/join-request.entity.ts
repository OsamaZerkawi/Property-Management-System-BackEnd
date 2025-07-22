import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AgentType } from "../enums/agent-type.enum";
import { createZstdDecompress } from "zlib";
import { UpdateAdminDto } from "src/application/dtos/auth/update-admin.dto";

@Entity('join_requests')        
export class JoinRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'enum',enum: AgentType})
    agent_type: AgentType;

    @Column({type:'varchar',length:255})
    agent_name: string;

    @Column({type: 'varchar',length:255})
    location: string;

    @Column({type:'varchar',length:255})
    proof_document: string;

    @Column({type: 'varchar',length:255})
    email: string;

    @CreateDateColumn()
    created_at: Date;

}