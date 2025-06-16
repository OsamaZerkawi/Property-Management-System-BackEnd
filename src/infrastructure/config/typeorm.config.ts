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
import { Tag } from "src/domain/entities/tag.entity";
import { PropertyPostTag } from "src/domain/entities/property-post-tag.entity";
import { Image } from "src/domain/entities/image.entity";
import { UserPost } from "src/domain/entities/user-post.entity";
import { UserPostSuggestion } from "src/domain/entities/user-post-suggestions.entity";
import { UserPropertyPurchase } from "src/domain/entities/user-property-purchase.entity";
import { UserPropertyInvoice } from "src/domain/entities/user-property-invoice.entity";
import { ServiceProvider } from "src/domain/entities/service-provider.entity";
import { ServiceFeedback } from "src/domain/entities/service-feedback.entity";

const OrmConfig = (configService: ConfigService): DataSourceOptions => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [
        User,RefreshToken,TokenBlackList,Office,City,
        Region,Property,Residential,PropertyPost,Tag,
        PropertyPostTag,Image,UserPost,UserPostSuggestion,
        UserPropertyPurchase,UserPropertyInvoice,ServiceProvider,
        ServiceFeedback,
    ],
    synchronize: true,
});

export default OrmConfig;