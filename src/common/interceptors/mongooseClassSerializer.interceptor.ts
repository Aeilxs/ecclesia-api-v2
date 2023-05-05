import {
  ClassSerializerInterceptor,
  Logger,
  PlainLiteralObject,
  Type,
} from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { Document } from 'mongoose';

function MongooseClassSerializerInterceptor(
  classToIntercept: Type,
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    logger: Logger;

    private changePlainObjectToClass(document: PlainLiteralObject) {
      if (!(document instanceof Document)) {
        return document;
      }

      return plainToClass(classToIntercept, document.toJSON());
    }

    private prepareResponse(
      response: PlainLiteralObject | PlainLiteralObject[],
    ) {
      this.logger = new Logger('MongooseClassSerializerInterceptor');
      this.logger.log('Serializing');
      if (Array.isArray(response)) {
        return response.map(this.changePlainObjectToClass);
      }

      return this.changePlainObjectToClass(response);
    }

    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions,
    ) {
      const r = super.serialize(this.prepareResponse(response), options);
      this.logger.log('Serialized', r);
      return r;
    }
  };
}

export default MongooseClassSerializerInterceptor;
