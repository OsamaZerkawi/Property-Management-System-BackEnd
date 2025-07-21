import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Region } from "./region.entity";
import { AdminCity } from "./admin-city.entity";

@Entity('cities')
export class City {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @OneToMany(() => Region, region => region.city,{cascade: true})
    regions: Region[];

    @OneToMany(() => AdminCity, adminCity => adminCity.city)
    cityAdmins: AdminCity[];
}