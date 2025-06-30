import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ComplaintStatus } from "../enums/complaint-status.enum";
import { Office } from "./offices.entity";
import { User } from "./user.entity";

@Entity('office_feedbacks')
@Index('IDX_office_feedback_user_id', ['user'])  
@Index('IDX_office_feedback_office_id', ['office'])
export class OfficeFeedback {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Office,(office) => office.feedbacks,{onDelete:'CASCADE'})
    @JoinColumn({name: 'office_id'})
    office: Office;

    @ManyToOne(() => User,(user) => user.office_feedbacks,{onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user: User;

    @Column({type: 'int',nullable: true})
    rate: number;

    @Column({type: 'text',nullable:true})
    complaint: string;

    @Column({type: 'enum',enum:ComplaintStatus,default:ComplaintStatus.PENDING})
    status: ComplaintStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn() 
    updated_at: Date;
}