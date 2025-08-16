import { Faqs } from "../entities/faqs.entity";

export const SUPPORT_REPOSITORY = 'SUPPORT_REPOSITORY';

export interface SupportRepositoryInterface {
    createFaqAndSave(faq: Partial<Faqs>);
    update(id: number,faq: Partial<Faqs>);
    delete(id: number);
    findAll();
}