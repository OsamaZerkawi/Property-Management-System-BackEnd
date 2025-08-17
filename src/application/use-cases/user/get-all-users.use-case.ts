import { Inject, Injectable } from '@nestjs/common';
import { UserListDto } from 'src/application/dtos/user/user-list.dto';
import {
  USER_REPOSITORY,
  UserRepositoryInterface,
} from 'src/domain/repositories/user.repository';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryInterface,
  ) {}

  async execute() {
    const users = await this.userRepo.findAllWithoutRole();

    return users.map((user) => new UserListDto(user));
  }
}
