import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { UserPropertyInvoice } from '../../domain/entities/user-property-invoice.entity';
import { Property } from '../../domain/entities/property.entity';
import { InvoicesStatus } from 'src/domain/enums/invoices-status.enum';
import { Office } from 'src/domain/entities/offices.entity';

@EventSubscriber()
export class ProfitsSubscriber
  implements EntitySubscriberInterface<UserPropertyInvoice>
{
  listenTo() {
    return UserPropertyInvoice;
  }

  async afterInsert(event: InsertEvent<UserPropertyInvoice>) { 
    if (event.entity?.status === InvoicesStatus.PAID) {
      await this.updateOfficeProfits(event, event.entity);
    }
  }

  async afterUpdate(event: UpdateEvent<UserPropertyInvoice>) { 
    const newInvoice = event.entity as UserPropertyInvoice;
    const oldInvoice = event.databaseEntity as UserPropertyInvoice;

    if (!newInvoice || !oldInvoice) return;

    if (
      oldInvoice.status !== InvoicesStatus.PAID &&
      newInvoice.status === InvoicesStatus.PAID
    ) {
      await this.updateOfficeProfits(event, newInvoice);
    }
  }

  private async updateOfficeProfits(
    event: InsertEvent<UserPropertyInvoice> | UpdateEvent<UserPropertyInvoice>,
    invoice: UserPropertyInvoice,
  ) {
    console.log('hi it works')
    const propertyRepo = event.manager.getRepository(Property);
    const officeRepo = event.manager.getRepository(Office);

    const property = await propertyRepo.findOne({
      where: { id: invoice.property.id },
      relations: ['office'],
    });

    if (!property?.office) return;

    const office = property.office;
    const commissionRate = office.commission || 0;
    const commissionAmount = (Number(invoice.amount) * commissionRate);

    await officeRepo.update(
      { id: office.id },
      { profits: () => `profits + ${commissionAmount}` },
    );
  }
}
