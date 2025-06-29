// import { Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
// import { Property } from "./property.entity";

// @Entity('property_favorites')
// @Unique(['user', 'property'])
// export class PropertyFavorite{
//     @PrimaryGeneratedColumn()
//     id: number;

//   @ManyToOne(() => User, user => user.propertyFavorites, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'user_id' })
//   user: User;

//   @ManyToOne(() => Property, property => property.propertyFavorites, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'property_id' })
//   property: Property;
// }
