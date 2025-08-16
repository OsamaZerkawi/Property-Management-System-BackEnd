import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { CreatePropertyPostDto } from 'src/application/dtos/property/CreatePropertyPost.dto';
import { UpdatePropertyPostDto } from 'src/application/dtos/property/UpdatePropertyPost.dto';
import { AdminCity } from 'src/domain/entities/admin-city.entity';
import { PropertyPost } from 'src/domain/entities/property-posts.entitiy';
import { PropertyPostStatus } from 'src/domain/enums/property-post-status.enum';
import { PropertyPostRepositoryInterface } from 'src/domain/repositories/property-post.repository';
import { errorResponse } from 'src/shared/helpers/response.helper';
import { In, Repository } from 'typeorm';

export class PropertyPostRepository implements PropertyPostRepositoryInterface {
  constructor(
    @InjectRepository(PropertyPost)
    private readonly propertyPostRepo: Repository<PropertyPost>,
  ) {}

  async findById(id: number) {
    return this.propertyPostRepo
      .createQueryBuilder('post')
      .leftJoin('post.property', 'property')
      .leftJoin('property.office', 'office')
      .leftJoin('office.user', 'user')
      .select([
        'post.id',
        'post.status',
        'post.title',
        'post.created_at',
        'property.id',
        'office.id',
        'user.id',
      ])
      .where('post.id = :id', { id })
      .getOne();
  }

  async update(id: number, fields: Partial<PropertyPost>) {
    await this.propertyPostRepo.update(id, fields);
  }

  async findPendingPostsForAdmin(adminId: number) {
    return await this.propertyPostRepo
      .createQueryBuilder('post')
      .select([
        'post.id',
        'post.title',
        'post.image',
        'property.property_type AS property_type',
        'office.name',
        'region.name',
        'city.name',

        'officeRegion.id',
        'officeRegion.name AS office_region',
        'officeCity.id',
        'officeCity.name AS office_city',

        'residential.listing_type',
        'residential.rental_price',
        'residential.rental_period',
        'residential.selling_price',
        'touristic.price',
      ])
      .innerJoin('post.property', 'property')
      .innerJoin('property.region', 'region')
      .innerJoin('region.city', 'city')
      .innerJoin('property.office', 'office')
      .innerJoin('office.region', 'officeRegion')
      .innerJoin('officeRegion.city', 'officeCity')
      .leftJoin(
        AdminCity,
        'adminCity',
        'adminCity.city_id = city.id AND adminCity.user_id = :adminId',
        { adminId },
      )
      .leftJoin('property.residential', 'residential')
      .leftJoin('property.touristic', 'touristic')
      .where('post.status = :status', { status: PropertyPostStatus.PENDING })
      .andWhere('property.is_deleted = false')
      .andWhere(
        `(adminCity.city_id IS NOT NULL OR 
        NOT EXISTS (
          SELECT 1 
          FROM admin_cities ac 
          WHERE ac.user_id = :adminId
        )
      )`,
        { adminId },
      )
      .getRawMany();
  }
  async createPropertyPostAndSaveIt(data: CreatePropertyPostDto) {
    const propertyPost = await this.propertyPostRepo.create({
      property: data.property,
      title: data.postTitle,
      image: data.postImage,
      description: data.postDescription,
      tag: data.postTag,
      date: new Date(),
    });

    await this.propertyPostRepo.save(propertyPost);

    return propertyPost;
  }

  async updatePropertyPost(id: number, data: UpdatePropertyPostDto) {
    const propertyPost = await this.propertyPostRepo.findOne({ where: { id } });

    if (!propertyPost) {
      throw new NotFoundException(
        errorResponse('لا يوجد منشور لهذا العقار', 404),
      );
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
      .where('id = :id', { id })
      .execute();

    if (shouldDeleteOldImage) {
      const oldImagePath = path.join(
        process.cwd(),
        'uploads/properties/posts/images',
        oldImage,
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updatedPropertyPost = await this.propertyPostRepo.findOne({
      where: { id },
    });

    return updatedPropertyPost;
  }

  private buildUpdatePayload(
    data: UpdatePropertyPostDto,
  ): Partial<PropertyPost> {
    const payload: Partial<PropertyPost> = {};

    if (data.postDescription !== undefined)
      payload.description = data.postDescription;
    if (data.postTag !== undefined) payload.tag = data.postTag;
    if (data.postImage !== undefined) payload.image = data.postImage;
    if (data.postTitle !== undefined) payload.title = data.postTitle;

    return payload;
  }
}
