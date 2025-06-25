import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Property } from "./property.entity";

@Entity('property_feedbacks')
@Index('IDX_feedback_user_id', ['user'])   
@Index('IDX_feedback_property_id', ['property'])
export class PropertyFeedback {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'int'})
    rate: number;

    @ManyToOne(() => User, user => user.property_feedbacks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => Property, property => property.feedbacks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'property_id' })
    property: Property;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}