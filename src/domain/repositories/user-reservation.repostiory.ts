
export const USER_RESERVATION_REPOSITORY = 'USER_RESERVATION_REPOSITORY';

export interface UserReservationRepositoryInterface {
  findTouristicReservationsByUser(userId: number,baseUrl: string);
  findResidentialReservationsByUser(userId: number,baseUrl: string);
}