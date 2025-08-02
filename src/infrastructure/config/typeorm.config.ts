import { DataSourceOptions } from "typeorm";
import { ConfigService } from '@nestjs/config';
import { User } from "src/domain/entities/user.entity";
import { RefreshToken } from "src/domain/entities/refresh-token.entity";
import { TokenBlackList } from "src/domain/entities/token-blacklist.entity";
import { Office } from "src/domain/entities/offices.entity";
import { City } from "src/domain/entities/city.entity";
import { Region } from "src/domain/entities/region.entity";
import { Property } from "src/domain/entities/property.entity";
import { Residential } from "src/domain/entities/residential.entity";
import { PropertyPost } from "src/domain/entities/property-posts.entitiy";
import { Image } from "src/domain/entities/image.entity";
import { UserPost } from "src/domain/entities/user-post.entity"; 
import {ServicePrice} from "src/domain/entities/service-price.entity"; 
import { UserPostSuggestion } from "src/domain/entities/user-post-suggestions.entity";
import { UserPropertyPurchase } from "src/domain/entities/user-property-purchase.entity";
import { UserPropertyInvoice } from "src/domain/entities/user-property-invoice.entity";
import { ServiceProvider } from "src/domain/entities/service-provider.entity";
import { ServiceFeedback } from "src/domain/entities/service-feedback.entity";
import { Role } from "src/domain/entities/role.entity";
import { UserRole } from "src/domain/entities/user-role.entity";
import { Permission } from "src/domain/entities/permissions.entity";
import { RolePermission } from "src/domain/entities/role-permissions.entity";
import { PropertyFeedback } from "src/domain/entities/property-feedback.entity";
import { OfficeFeedback } from "src/domain/entities/office-feedback.entity";
import { PropertyFavorite } from "src/domain/entities/property-favorite.entity";
import { Booking } from "src/domain/entities/booking.entity";
import { Touristic } from "src/domain/entities/touristic.entity";
import { Calendar } from "src/domain/entities/calendar.entity";
import { RentalContract } from "src/domain/entities/rental-contract.entity";
import { Otp } from "src/domain/entities/otp.entity";
import { TempUser } from "src/domain/entities/temp-user.entity";
import { OfficeSocial } from "src/domain/entities/office-social.entity";
import { Notification } from "src/domain/entities/notification.entity";
import { FcmToken } from "src/domain/entities/fcmToken.entity";
import { Advertisement } from "src/domain/entities/advertisements.entity";
import { OnlineInvoice } from "src/domain/entities/online-invoices.entity";
import { UserPermission } from "src/domain/entities/user-permission.entity";
import { AdditionalService } from 'src/domain/entities/additional-service.entity';
import { Service } from 'src/domain/entities/services.entity';
import { AdminCity } from "src/domain/entities/admin-city.entity";
import { JoinRequest } from "src/domain/entities/join-request.entity";
import { PromotedProperty } from "src/domain/entities/promoted-property.entity";
import { ServiceProviderSocial } from "src/domain/entities/service-providers-social.entity";
import { InvoiceReminderLog } from "src/domain/entities/invoice-reminder-log.entity";
const OrmConfig = (configService: ConfigService): DataSourceOptions => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [
        User,RefreshToken,TokenBlackList,Office,City,
        Region,Property,Residential,PropertyPost,
        Image,UserPost,UserPostSuggestion,
        UserPropertyPurchase,UserPropertyInvoice,ServiceProvider,
        ServiceFeedback,Role,UserRole,Permission,RolePermission,
        PropertyFeedback,OfficeFeedback,OfficeSocial,PropertyFavorite,
        Booking,Touristic,Calendar,RentalContract,
        PropertyFeedback,OfficeFeedback ,OfficeSocial,Otp, TempUser,ServicePrice,
        Notification,FcmToken,Advertisement,OnlineInvoice,UserPermission,
        Otp, TempUser,ServicePrice,AdditionalService,Service,AdminCity,
        JoinRequest,PromotedProperty,ServiceProviderSocial,InvoiceReminderLog,
    ],
    synchronize: true,
    //dropSchema: true,
});

export default OrmConfig;