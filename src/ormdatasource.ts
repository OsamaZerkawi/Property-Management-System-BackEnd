import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import OrmConfig from './infrastructure/config/typeorm.config';
import { ConfigService } from '@nestjs/config';

// Load environment variables
config();

// Create ConfigService instance
const configService = new ConfigService();

// Create DataSource with configuration
export default new DataSource(OrmConfig(configService));