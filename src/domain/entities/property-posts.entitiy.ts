import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PropertyPostStatus } from "../enums/property-post-status.enum";
import { Property } from "./property.entity";
import { PropertyPostTag } from "../enums/property-post-tag.enum";

@Entity('property_posts')
export class PropertyPost {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({type: 'text'})
    description: string;

    @Column()
    image: string;

    @Column() 
    date: Date;

    @Column({type:'enum',enum:PropertyPostTag})
    tag: PropertyPostTag;

    @Column({ type: 'enum', enum: PropertyPostStatus, default: PropertyPostStatus.PENDING })
    status: PropertyPostStatus;

    @OneToOne(() => Property, property => property.post, { onDelete: 'CASCADE' })
    @JoinColumn()
    property: Property;

    // @OneToMany(() => PropertyPostTag, (ppt) => ppt.propertyPost)
    // propertyPostTags: PropertyPostTag[];

    @CreateDateColumn()
    created_at: Date;  

    @UpdateDateColumn()
    updated_at: Date;
}