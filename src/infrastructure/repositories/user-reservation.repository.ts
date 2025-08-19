import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Booking } from "src/domain/entities/booking.entity";
import { RentalContract } from "src/domain/entities/rental-contract.entity";
import { UserReservationRepositoryInterface } from "src/domain/repositories/user-reservation.repostiory";
import { Repository } from "typeorm";

export class UserReservationRepository implements UserReservationRepositoryInterface     {
    
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepo: Repository<Booking>,
        @InjectRepository(RentalContract)
        private readonly rentalContractRepo: Repository<RentalContract>,
    ){}
    
    findTouristicReservationsByUser(userId: number, baseUrl: string) {
    return this.bookingRepo
      .createQueryBuilder('b')
      .innerJoin('b.calendar', 'c')
      .innerJoin('c.touristic', 't')
      .innerJoin('t.property', 'p')
      .innerJoin('p.post', 'pp')
      .innerJoin('p.region', 'region')
      .innerJoin('region.city', 'city')
      .select([
        'b.id AS id',
        'p.id AS property_id', 
        `'سياحي' AS type`,
        'pp.title AS title',
        'CAST(t.price AS INT) AS rental_price',
        `'يومي' AS rental_period`,
        `CONCAT('${baseUrl}/uploads/properties/posts/images', pp.image) AS image`,
        "TO_CHAR(c.start_date, 'YYYY-MM-DD') AS start_date",
        "TO_CHAR(c.end_date, 'YYYY-MM-DD') AS end_date",
        `CONCAT(city.name, ', ', region.name) AS location`,
        'c.status AS status',
      ])
      .where('b.user_id = :userId', { userId })
      .orderBy('c.start_date', 'DESC')
      .getRawMany();        
    }
    
    findResidentialReservationsByUser(userId: number, baseUrl: string) {
    return this.rentalContractRepo
      .createQueryBuilder('rc')
      .innerJoin('rc.residential', 'r')
      .innerJoin('r.property', 'p')
      .innerJoin('p.post', 'pp')
      .innerJoin('p.region', 'region')
      .innerJoin('region.city', 'city')
      .select([
        'rc.id AS id',
        'p.id AS property_id', 
        `'عقاري' AS type`,
        'pp.title AS title',
        'r.rental_price AS rental_price',
        'r.rental_period AS rental_period',
        `CONCAT('${baseUrl}/uploads/properties/posts/images', pp.image) AS image`,
        "TO_CHAR(rc.start_date, 'YYYY-MM-DD') AS start_date",
        "TO_CHAR(rc.end_date, 'YYYY-MM-DD') AS end_date",
        `CONCAT(city.name, ', ', region.name) AS location`,
        'rc.status AS status',
      ])
      .where('rc.user_id = :userId', { userId })
      .orderBy('rc.start_date', 'DESC')
      .getRawMany();        
    }

}