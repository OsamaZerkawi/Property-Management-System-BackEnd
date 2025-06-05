import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { City } from "./city.entity";
import { Office } from "./offices.entity";
import { Property } from "./property.entity";

@Unique(['name', 'city'])
@Entity('regions')
export class Region {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    name: string;

    @ManyToOne(() => City, city => city.regions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'city_id' }) 
    city: City;

    @Column({
        type:'decimal',
        precision:5
    })
    default_meter_price;

    @OneToMany(() => Office, office => office.region)
    offices: Office[];

    @OneToMany(() => Property, (property) => property.region)
    properties: Property[];
}