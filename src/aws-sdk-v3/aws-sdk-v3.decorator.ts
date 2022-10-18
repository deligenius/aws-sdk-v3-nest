import { Inject } from '@nestjs/common';
import { ClassDefinition } from './aws-sdk-v3.type';
import { AWS_SDK_V3_MODULE } from './constants';

export const InjectAws = <C extends ClassDefinition>(client: C, key = '') => {
  const providerToken = `${AWS_SDK_V3_MODULE}#${client.name}#${key}`;

  return Inject(providerToken);
};
