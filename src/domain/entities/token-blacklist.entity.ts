import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity({name:'token_blacklist'})
export class TokenBlackList{
    @PrimaryColumn('varchar' , {length : 512})
    token: string;

    @Column({type : 'timestamp'})
    @Index()
    expiresAt: Date;

    @Column()
    userId : number;
}