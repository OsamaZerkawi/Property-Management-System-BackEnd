// application/use-cases/tourism/get-touristic-availability.use-case.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ITourismRepository, TOURISM_REPOSITORY } from 'src/domain/repositories/tourism.repository';

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
    const pricePerDay = Number(touristic.price ?? 0);

  
    const office = property.office;
    const deposit = office?.tourism_deposit ?? 0; 
 
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()); 
    console.log(startDate)
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (15 - 1));
 
    const calendars = await this.tourismRepo.findCalendarsForTouristicInRange(
      touristicId,
      startDate,
      endDate,
    );
 
    const bookedDays = new Set<string>();
    for (const cal of calendars) {
      const calStart = new Date(cal.start_date);
      const calEnd = new Date(cal.end_date);
      // normalize to start of days
      const cur = new Date(calStart.getFullYear(), calStart.getMonth(), calStart.getDate());
      const last = new Date(calEnd.getFullYear(), calEnd.getMonth(), calEnd.getDate());
      while (cur <= last) {
        // if inside requested range
        if (cur >= startDate && cur <= endDate) {
          bookedDays.add(cur.toISOString().slice(0, 10));
        }
        cur.setDate(cur.getDate() + 1);
      }
    }
 
    const daysArray: Array<{ date: string; status: 'محجوز' | 'منتهي' | 'متوفر' }> = [];
    let availableCount = 0;

    for (let i = 0; i < 15; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const iso = d.toISOString().slice(0, 10);

       const now = new Date();
      const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      let status: 'محجوز' | 'منتهي' | 'متوفر' = 'متوفر';
      if (d < todayOnly) {
        status = 'منتهي';
      } else if (bookedDays.has(iso)) {
        status = 'محجوز';
      } else {
        status = 'متوفر';
        availableCount++;
      }
      daysArray.push({ date: iso, status });
    }

    return {
      days: daysArray,
      availableCount,
      pricePerDay,
      deposit, 
      periodStart: startDate.toISOString().slice(0, 10),
      periodEnd: endDate.toISOString().slice(0, 10),
    };
  }
}
