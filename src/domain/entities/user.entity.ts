import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { RefreshToken } from "./refresh-token.entity";
import { Office } from "./offices.entity";
import { UserPost } from "./user-post.entity";
import { UserPropertyPurchase } from "./user-property-purchase.entity";
import { UserPropertyInvoice } from "./user-property-invoice.entity";
import { ServiceProvider } from "./service-provider.entity";
import { ServiceFeedback } from "./service-feedback.entity";
import { UserRole } from "./user-role.entity";
import { Property } from "./property.entity";

@Entity({name: 'users'})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({unique:true})
  phone: string;

  @Column({unique: true,nullable:true})
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  stripe_customer_id: string;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshToken: RefreshToken;

  @OneToOne(() => Office, (office) => office.user)
  office: Office;

  @OneToMany(() => UserPost,post => post.user)
  userPosts: UserPost[];

  @OneToMany(() => UserPropertyPurchase,(purchase) => purchase.user)
  propertyPurchases: UserPropertyPurchase[];

  @OneToMany(() => UserPropertyInvoice, (invoice) => invoice.user)
  invoices: UserPropertyInvoice[];
  
  @OneToOne(() => ServiceProvider, (sp) => sp.user)
  serviceProvider: ServiceProvider;

  @OneToMany(() => ServiceFeedback, (feedback) => feedback.user)
  feedbacks: ServiceFeedback[];

  @OneToMany(() => UserRole, ur => ur.user)
  userRoles: UserRole[];

  @ManyToMany(() => Property, property => property.favoritedByUsers)
  @JoinTable({
    name: 'property_favorites',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'property_id', referencedColumnName: 'id' },
  })
  favoriteProperties: Property[];

  // @OneToMany(() => UserPermission, up => up.user)
  // userPermissions: UserPermission[];
 
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}