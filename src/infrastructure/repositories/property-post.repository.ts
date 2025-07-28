import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from 'fs';
import * as path from 'path';
import { CreatePropertyPostDto } from "src/application/dtos/property/CreatePropertyPost.dto";
import { UpdatePropertyPostDto } from "src/application/dtos/property/UpdatePropertyPost.dto";
import { PropertyPost } from "src/domain/entities/property-posts.entitiy";
import { PropertyPostRepositoryInterface } from "src/domain/repositories/property-post.repository";
import { errorResponse } from "src/shared/helpers/response.helper";
import { In, Repository } from "typeorm";

export class PropertyPostRepository implements PropertyPostRepositoryInterface {
    constructor(
        @InjectRepository(PropertyPost)
        private readonly propertyPostRepo: Repository<PropertyPost>,
    ){}
    async createPropertyPostAndSaveIt(data: CreatePropertyPostDto) {
        const propertyPost = await this.propertyPostRepo.create({
            property:data.property,
            title: data.postTitle,
            image: data.postImage,
            description:data.postDescription,
            tag:data.postTag,
            date: new Date(),
        });

        await this.propertyPostRepo.save(propertyPost);

        return propertyPost;
    }

  async updatePropertyPost(id: number, data: UpdatePropertyPostDto) {

    const propertyPost = await this.propertyPostRepo.findOne({ where: { id } });
  
    if (!propertyPost) {
      throw new NotFoundException(errorResponse('لا يوجد منشور لهذا العقار', 404));
    }
  
    const updatePayload = this.buildUpdatePayload(data);

    if (Object.keys(updatePayload).length === 0) {
      return propertyPost;
    }
  
    const oldImage = propertyPost.image;
  
    const shouldDeleteOldImage =
    data.postImage &&
    propertyPost.image &&
    data.postImage !== propertyPost.image;

    await this.propertyPostRepo
    .createQueryBuilder()
    .update(PropertyPost)
    .set(updatePayload)
    .where("id = :id", { id })
    .execute();
  
    if (shouldDeleteOldImage) {
      const oldImagePath = path.join(
        process.cwd(),
        'uploads/properties/posts/images',
        oldImage
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
  
    const updatedPropertyPost = await this.propertyPostRepo.findOne({ where: { id } });

    return updatedPropertyPost;
  }

  private buildUpdatePayload(data: UpdatePropertyPostDto): Partial<PropertyPost> {
    const payload: Partial<PropertyPost> = {};
  
    if (data.postDescription !== undefined) payload.description = data.postDescription;
    if (data.postTag !== undefined) payload.tag = data.postTag;
    if (data.postImage !== undefined) payload.image = data.postImage;
    if (data.postTitle !== undefined) payload.title = data.postTitle;

  
    return payload;
  }
}