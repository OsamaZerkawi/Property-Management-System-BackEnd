import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { JoinRequest } from 'src/domain/entities/join-request.entity';
import { AdminAgreement } from 'src/domain/enums/admin-agreement.enum';
import { AgentType } from 'src/domain/enums/agent-type.enum';

export class JoinRequestSeeder {
  constructor(
    @InjectRepository(JoinRequest)
    private readonly joinRequestRepo: Repository<JoinRequest>,
    private readonly dataSource: DataSource,
  ) {}

  async seed() {
    await this.dataSource.query(
      'TRUNCATE TABLE join_requests RESTART IDENTITY CASCADE',
    );

    for (let i = 0; i < 10; i++) {
        const { latitude, longitude } = randomLocationInSyria();
      const joinRequest: Partial<JoinRequest> = {
        agent_type: faker.helpers.arrayElement(Object.values(AgentType)),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        admin_agreement: AdminAgreement.PENDING,
        latitude,
        longitude,
        proof_document: `proof${i + 1}.jpg`,
        email: faker.internet.email(),
        created_at: faker.date.past(),
      };

      await this.joinRequestRepo.save(joinRequest);
    }

    console.log('✅ Fake join requests have been seeded successfully.');
  }
}


function randomLocationInSyria() {
  const lat = faker.number.float({
    min: 32.0,
    max: 37.5,
    fractionDigits: 6
  });

  const lng = faker.number.float({
    min: 35.6,
    max: 42.0,
    fractionDigits: 6
  });

  return { latitude: lat, longitude: lng };
}