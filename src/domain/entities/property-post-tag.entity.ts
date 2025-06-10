import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { PropertyPost } from './property-posts.entitiy';
import { Tag } from './tag.entity';

@Unique(['propertyPost', 'tag']) 
@Entity('property_post_tags')
export class PropertyPostTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PropertyPost, (post) => post.propertyPostTags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'property_post_id' })
  propertyPost: PropertyPost;

  @ManyToOne(() => Tag, (tag) => tag.propertyPostTags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
