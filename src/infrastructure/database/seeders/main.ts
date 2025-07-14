import { NestFactory } from "@nestjs/core";
import { ServiceProviderModule } from "src/presentation/http/modules/service-provider.module";
import { SeederModule } from "./seeder.module";
import { SeederService } from "./seeder.service";

async function bootstrap() {
    const app = await NestFactory.create(SeederModule);
    const seeder = app.get(SeederService);

    await seeder.run();
    await app.close();
}

bootstrap();