import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { Office } from './offices.entity';
import { UserPost } from './user-post.entity';
import { UserPropertyPurchase } from './user-property-purchase.entity';
import { UserPropertyInvoice } from './user-property-invoice.entity';
import { ServiceProvider } from './service-provider.entity';
import { ServiceFeedback } from './service-feedback.entity';
import { UserRole } from './user-role.entity';
import { PropertyFeedback } from './property-feedback.entity';
import { OfficeFeedback } from './office-feedback.entity';
import { PropertyFavorite } from './property-favorite.entity';
import { Booking } from './booking.entity';
import { RentalContract } from './rental-contract.entity';
import { FcmToken } from './fcmToken.entity';
import { UserPermission } from './user-permission.entity';
import { AdminCity } from './admin-city.entity';
import { Notification } from './notification.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ unique: true, nullable: true })
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

  @OneToMany(() => UserPost, (post) => post.user)
  userPosts: UserPost[];

  @OneToMany(() => UserPropertyPurchase, (purchase) => purchase.user)
  propertyPurchases: UserPropertyPurchase[];

  @OneToMany(() => UserPropertyInvoice, (invoice) => invoice.user)
  invoices: UserPropertyInvoice[];

  @OneToOne(() => ServiceProvider, (sp) => sp.user)
  serviceProvider: ServiceProvider;

  @OneToMany(() => ServiceFeedback, (feedback) => feedback.user)
  service_feedbacks: ServiceFeedback[];

  @OneToMany(() => PropertyFeedback, (feedback) => feedback.user)
  property_feedbacks: PropertyFeedback[];

  @OneToMany(() => OfficeFeedback, (feedback) => feedback.user)
  office_feedbacks: OfficeFeedback[];

  @OneToMany(() => UserRole, (ur) => ur.user)
  userRoles: UserRole[];
  
  @OneToMany(() => PropertyFavorite, (favorite) => favorite.user)
  propertyFavorites: PropertyFavorite[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => RentalContract, (rentalContract) => rentalContract.user)
  rentalContracts: RentalContract[];

  @OneToMany(() => FcmToken, (fcmToken) => fcmToken.user)
  fcmTokens: FcmToken[];

  @OneToMany(() => UserPermission, (up) => up.user)
  userPermissions: UserPermission[];

  @OneToOne(() => AdminCity, (adminCity) => adminCity.user)
  adminCities: AdminCity;

  @OneToMany(() => Notification, (notification) => notification.sender)
  sentNotifications: Notification[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
