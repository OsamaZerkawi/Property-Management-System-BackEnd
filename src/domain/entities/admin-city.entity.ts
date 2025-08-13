import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { City } from "./city.entity";


@Entity('admin_cities')   
@Index(['user_id'],{unique: true}) 
@Index(['city_id'])        
@Index(['user_id', 'city_id'], { unique: true })
export class AdminCity{
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  city_id: number;

  @ManyToOne(() => User, user => user.adminCities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => City, city => city.cityAdmins, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'city_id' })
  city: City;
}