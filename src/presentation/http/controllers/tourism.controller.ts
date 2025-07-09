// presentation/http/controllers/tourism.controller.ts
import { Controller, Post, Body, UseGuards,BadRequestException } from '@nestjs/common';
import { CreateTourismDto } from '../../../application/dtos/tourism/create-tourism.dto';
import { CreateTourismUseCase } from '../../../application/use-cases/tourism/create-tourism.use-case';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';

@Controller('tourism')
export class TourismController {
  constructor(private readonly createTourism: CreateTourismUseCase) {}
@UseGuards(JwtAuthGuard)
@Post()
async create(
  @CurrentUser() user,
  @Body() body: any,
) {
  const requiredKeys = ['post', 'public_information', 'tourism_place'];

  for (const key of requiredKeys) {
    if (!(key in body)) {
      throw new BadRequestException(`Missing required key: ${key}`);
    }
  }

  const dto = new CreateTourismDto();
  Object.assign(dto, body.post, body.public_information, body.tourism_place);

  const userId = user.sub;
  return this.createTourism.execute(userId, dto);
}

  }
 

