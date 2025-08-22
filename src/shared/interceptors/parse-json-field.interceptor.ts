import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseJsonFieldsPipe implements PipeTransform {
  constructor(private readonly fields: string[] = []) {}

  transform(value: any) {
    if (!value || typeof value !== 'object') return value;
    for (const f of this.fields) {
      if (value[f] && typeof value[f] === 'string') {
        try {
          value[f] = JSON.parse(value[f]);
        } catch {
          throw new BadRequestException(`Invalid JSON in field ${f}`);
        }
      }
    }
    return value;
  }
}
