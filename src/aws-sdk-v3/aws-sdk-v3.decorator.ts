import { Inject } from '@nestjs/common';
import { ClassDefinition } from './aws-sdk-v3.type';
import { getClientToken } from './aws-sdk-v3.util';

export const InjectAws = <C extends ClassDefinition>(client: C, key = '') => {
  const providerToken = getClientToken(client, key);

  return Inject(providerToken);
};
