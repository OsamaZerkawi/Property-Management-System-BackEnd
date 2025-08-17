import { RegisterSubscriberDto } from 'src/application/dtos/auth/register-subscriber.dto';
import { JoinRequest } from '../entities/join-request.entity';
import { AdminAgreement } from '../enums/admin-agreement.enum';

export const JOIN_REQUEST_REPOSITORY = 'JOIN_REQUEST_REPOSITORY';

export interface JoinRequestRepositoryInterface {
  findById(id: number);
  updateStatus(id: number, updateData: Partial<JoinRequest>);
  findAll();
  register(data: RegisterSubscriberDto);
}
