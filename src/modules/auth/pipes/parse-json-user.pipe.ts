import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseJsonUserPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    const type = value.type;

    const userEntity = JSON.parse(value[type]);
    value[type] = userEntity;

    return value;
  }
}
