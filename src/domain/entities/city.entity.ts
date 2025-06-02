import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Region } from "./region.entity";

@Entity('cities')
export class City {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Region, region => region.city)
    regions: Region[];
}