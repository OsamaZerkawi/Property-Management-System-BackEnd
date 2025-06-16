import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserPost } from "./user-post.entity";
import { Property } from "./property.entity";

@Entity('user_post_suggestions')
export class UserPostSuggestion{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() =>UserPost, userPost => userPost.userPostSuggestions,{onDelete:'CASCADE'})
    @JoinColumn({name:'user_post_id'})
    userPost: UserPost;

    @ManyToOne(() => Property,property => property.userPostSuggestions,{onDelete:'CASCADE'})
    @JoinColumn({name:'property_id'})
    property: Property;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

}