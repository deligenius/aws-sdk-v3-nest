import { Inject } from "@nestjs/common";
import type { ClassDefinition } from "./aws-sdk-v3.type.js";
import { getClientToken } from "./aws-sdk-v3.util.js";

export const InjectAws = <C extends ClassDefinition>(client: C, key = "") => {
	const providerToken = getClientToken(client, key);

	return Inject(providerToken);
};
