import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Property } from "./property.entity";

@Entity('images')
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    image_path: string;

    @ManyToOne(() => Property, (property) => property.images, {
    onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'property_id' })
    property: Property;
    
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;


}
