import { fa } from '@faker-js/faker/.';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Faqs } from 'src/domain/entities/faqs.entity';
import { SupportRepositoryInterface } from 'src/domain/repositories/support.repository';
import { errorResponse } from 'src/shared/helpers/response.helper';
import { Repository } from 'typeorm';

export class SupportRepository implements SupportRepositoryInterface {
  constructor(
    @InjectRepository(Faqs)
    private readonly faqRepo: Repository<Faqs>,
  ) {}
  async findAll() {
    return await this.faqRepo.find({
      select: ['id', 'question', 'answer'],
      order: { created_at: 'ASC' },
    });
  }

  async delete(id: number) {
    const faq = await this.faqRepo.findOne({
      where: { id },
    });

    if (!faq) {
      throw new NotFoundException(errorResponse('السؤال غير موجود', 404));
    }
    await this.faqRepo.delete(id);
  }
  async update(id: number, faq: Partial<Faqs>) {
    await this.faqRepo.update(id, faq);
  }

  async createFaqAndSave(faq: Partial<Faqs>) {
    const entity = this.faqRepo.create(faq);
    return await this.faqRepo.save(entity);
  }
}
