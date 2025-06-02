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

const OrmConfig = (configService: ConfigService): DataSourceOptions => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [User,RefreshToken,TokenBlackList,Office,City,Region,Property,Residential],
    synchronize: true,
});

export default OrmConfig;