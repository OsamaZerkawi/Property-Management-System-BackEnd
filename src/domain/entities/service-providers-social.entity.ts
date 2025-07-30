import { BULL_CONFIG_DEFAULT_TOKEN } from "@nestjs/bull";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SocialMediaPlatform } from "../enums/social-media-platform.enum";
import { ServiceProvider } from "./service-provider.entity";

@Entity('service_provider_socials')
export class ServiceProviderSocial {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'enum',enum: SocialMediaPlatform})
    platform: SocialMediaPlatform;

    @Column()
    link: string;

    @ManyToOne(
      () => ServiceProvider,
      (serviceProvider) => serviceProvider.socials,
      { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'service_provider_id' })
    serviceProvider: ServiceProvider;    

    @CreateDateColumn()
    created_at: Date;

}