import {
	type ClassConstructorReturnType,
	type ClassDefinition,
	isClassDefinition,
} from "./aws-sdk-v3.type.js";

const AWS_SDK_V3_MODULE = "AWS_SDK_V3_MODULE";

export function getClientToken<C extends ClassDefinition>(
	client: ClassDefinition | ClassConstructorReturnType<C>,
	key = "",
) {
	if (isClassDefinition(client)) {
		return `${AWS_SDK_V3_MODULE}#${client.name}#${key}`;
	}
	// @ts-ignore
	const className = client.__proto__.constructor.name as string;
	return `${AWS_SDK_V3_MODULE}#${className}#${key}`;
}
