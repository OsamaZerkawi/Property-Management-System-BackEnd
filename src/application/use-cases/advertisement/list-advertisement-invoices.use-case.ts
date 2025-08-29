import { Inject, NotFoundException } from '@nestjs/common';
import { AdminAgreement } from 'src/domain/enums/admin-agreement.enum';
import { ServiceType } from 'src/domain/enums/service-type.enum';
import {
  ADVERTISEMENT_REPOSITORY,
  AdvertisementRepositoryInterface,
} from 'src/domain/repositories/advertisement.repository';
import {
  OFFICE_REPOSITORY,
  OfficeRepositoryInterface,
} from 'src/domain/repositories/office.repository';
import { errorResponse } from 'src/shared/helpers/response.helper';
import { GetServicePriceUseCase } from '../get-service-price.use-case';
import { StripeService } from 'src/application/services/stripe.service';

export class ListOfficeInvoicesUseCase {
  constructor(
    @Inject(ADVERTISEMENT_REPOSITORY)
    private readonly adRepo: AdvertisementRepositoryInterface,

    @Inject(OFFICE_REPOSITORY)
    private readonly officeRepo: OfficeRepositoryInterface,
    private readonly getServicePriceUseCase: GetServicePriceUseCase,
    private readonly stripeService: StripeService, 
  ) {}

 async execute(userId: number, type: ServiceType) {
  const office = await this.officeRepo.findOfficeByUserId(userId);
  if (!office)
    throw new NotFoundException(
      errorResponse('لا يوجد مكتب مرتبط بالمستخدم', 404),
    );

  if (type === ServiceType.IMAGE_AD) {
    const ads = await this.adRepo.findAllWithInvoicesByOfficeId(office.id);
    const protocol = 'https';
    const host = '0ad82425026d.ngrok-free.app';  
    const successUrl = `${protocol}://${host}/success`;
    const cancelUrl = `${protocol}://${host}/cancel`;
    const pricePerDay = await this.getServicePriceUseCase.execute(ServiceType.IMAGE_AD);

    const results = await Promise.all(
      ads.map(async (ad) => {
        const amountInCents = pricePerDay * ad.day_period * 100;

        const session = await this.stripeService.createCheckoutSession(
          amountInCents,
          'usd',
          successUrl,
          cancelUrl,
        ); 
        return {
          advertisement_id: ad.id,
          invoice_id: ad.invoice?.id,
          paid_date: ad.invoice?.paid_date,
          type: ServiceType.IMAGE_AD,
          day_period: ad.day_period,
          amount: pricePerDay * ad.day_period,
          advertisement_status: ad.invoice? 'مدفوع': ad.admin_agreement === AdminAgreement.PENDING? AdminAgreement.PENDING: ad.admin_agreement === AdminAgreement.APPROVED? 'تم الموافقة': AdminAgreement.REJECTED,
          stripeUrl: session.url, 
        };
      }),
    );

    return results;
  } else {
    return [];
  }
}

}
