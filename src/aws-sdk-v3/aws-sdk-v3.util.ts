import {
  ClassConstructorReturnType,
  ClassDefinition,
  isClassDefinition,
} from './aws-sdk-v3.type';

const AWS_SDK_V3_MODULE = 'AWS_SDK_V3_MODULE';

export function getClientToken<C extends ClassDefinition>(
  client: ClassDefinition | ClassConstructorReturnType<C>,
  key = ''
) {
  if (isClassDefinition(client)) {
    return `${AWS_SDK_V3_MODULE}#${client.name}#${key}`;
  } else {
    const className = client.__proto__.constructor.name as string;
    return `${AWS_SDK_V3_MODULE}#${className}#${key}`;
  }
}
