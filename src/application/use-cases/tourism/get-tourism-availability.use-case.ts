// application/use-cases/tourism/get-touristic-availability.use-case.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ITourismRepository, TOURISM_REPOSITORY } from 'src/domain/repositories/tourism.repository';
import { startOfDay, addDays, format, isBefore } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
@Injectable()
export class GetTouristicAvailabilityUseCase {
  constructor(
    @Inject(TOURISM_REPOSITORY)
    private readonly tourismRepo: ITourismRepository,  
  ) {}
  
async execute(propertyId: number) {
  const property = await this.tourismRepo.findPropertyWithTouristicAndOffice(propertyId);
  if (!property) throw new NotFoundException('العقار غير موجود');

  const touristic = property.touristic;
  if (!touristic) throw new NotFoundException('تفاصيل العقار السياحي غير موجودة');

  const touristicId = touristic.id;
  const price = Number(touristic.price ?? 0);
  const office = property.office;
  const deposit = Number(office?.tourism_deposit_percentage) ?? 0;
  const commission = Number(office?.commission) ?? 0;

  const daysCount = 15;

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  const today = startOfDay(toZonedTime(new Date(), timeZone));
  const startDate = addDays(today, 1);
  const endDate = startOfDay(toZonedTime(addDays(startDate, daysCount - 1), timeZone));

  const calendars = await this.tourismRepo.findCalendarsForTouristicInRange(
    touristicId,
    startDate,
    endDate,
  );
 
  const bookedDays = new Set<string>();
  for (const cal of calendars) {
    if (!cal.start_date || !cal.end_date) continue;

    let calStart = startOfDay(toZonedTime(new Date(cal.start_date), timeZone));
    let calEnd = startOfDay(toZonedTime(new Date(cal.end_date), timeZone));

    let cur = calStart;
    while (cur <= calEnd) {
      if (cur >= startDate && cur <= endDate) {
        bookedDays.add(format(cur, 'yyyy-MM-dd'));
      }
      cur = addDays(cur, 1);
    }
  }
 
  const daysArray: Array<{ date: string; status: 'محجوز' | 'منتهي' | 'متوفر' }> = [];
  let availableCount = 0;

  for (let i = 0; i < daysCount; i++) {
    const d = startOfDay(toZonedTime(addDays(startDate, i), timeZone));
    const key = format(d, 'yyyy-MM-dd');
    const display = format(d, 'd-M-yyyy');

    let status: 'محجوز' | 'منتهي' | 'متوفر' = 'متوفر';

    if (isBefore(d, startOfDay(toZonedTime(new Date(), timeZone)))) {
      status = 'منتهي';
    } else if (bookedDays.has(key)) {
      status = 'محجوز';
    } else {
      status = 'متوفر';
      availableCount++;
    }

    daysArray.push({ date: display, status });
  }

  return {
    days: daysArray,
    availableCount,
    price,
    deposit,
    commission,
    // periodStart: format(startDate, 'd-M-yyyy'),
    // periodEnd: format(endDate, 'd-M-yyyy'),
  };
}

}
