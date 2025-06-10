import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from 'fs';
import * as path from 'path';
import { CreatePropertyPostDto } from "src/application/dtos/property/CreatePropertyPost.dto";
import { UpdatePropertyPostDto } from "src/application/dtos/property/UpdatePropertyPost.dto";
import { PropertyPostTag } from "src/domain/entities/property-post-tag.entity";
import { PropertyPost } from "src/domain/entities/property-posts.entitiy";
import { Tag } from "src/domain/entities/tag.entity";
import { PropertyPostRepositoryInterface } from "src/domain/repositories/property-post.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
import { In, Repository } from "typeorm";

export class PropertyPostRepository implements PropertyPostRepositoryInterface {
    constructor(
        @InjectRepository(PropertyPost)
        private readonly propertyPostRepo: Repository<PropertyPost>,
        @InjectRepository(PropertyPostTag)
        private readonly propertyPostTagRepo: Repository<PropertyPostTag>
    ){}
    async createPropertyPostAndSaveIt(data: CreatePropertyPostDto) {
        const propertyPost = await this.propertyPostRepo.create({
            property:data.property,
            title: data.postTitle,
            image: data.postImage,
            date: new Date(),
        });

        await this.propertyPostRepo.save(propertyPost);

        return propertyPost;
    }

    async attachTagsToPost(post: PropertyPost, tags: Tag[]) {
        const tagIds = tags.map(tag => tag.id);
      
        const existingPostTags = await this.propertyPostTagRepo.find({
          where: {
            propertyPost: { id: post.id },
            tag: In(tagIds),
          },
          relations: ['tag'],
        });
      
        const existingTagIds = new Set(existingPostTags.map(pt => pt.tag.id));
      
        const postTagsToSave = tags
          .filter(tag => !existingTagIds.has(tag.id))
          .map(tag =>
            this.propertyPostTagRepo.create({
              propertyPost: post,
              tag,
            })
          );
      
        if (postTagsToSave.length) {
          await this.propertyPostTagRepo.save(postTagsToSave);
        }
    }

  async updatePropertyPost(id: number, data: UpdatePropertyPostDto) {
    const propertyPost = await this.propertyPostRepo.findOne({where: {id}});

    if(!propertyPost){
      throw new NotFoundException(
        errorResponse('لا يوجد منشور لهذا العقار',404)
      );
    }
    const updatePayload: Partial<PropertyPost> = {};

    if (data.postTitle !== undefined) updatePayload.title = data.postTitle;
    if (data.postImage !== undefined) updatePayload.image = data.postImage;

    
    if (Object.keys(updatePayload).length === 0) {
      return propertyPost;
    }

    const oldImage = propertyPost.image;

    await this.propertyPostRepo
      .createQueryBuilder()
      .update(PropertyPost)
      .set(updatePayload)
      .where("id = :id", { id })
      .execute();
        
      
    if (data.postImage && oldImage) {
      const oldImagePath = path.join(process.cwd(), 'uploads/properties/posts/images', oldImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updatedPropertyPost = await this.propertyPostRepo
    .createQueryBuilder('post')
    .where("post.id = :id", { id })
    .getOne();

    return updatedPropertyPost;

  }
}