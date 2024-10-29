import {
	type DynamicModule,
	type InjectionToken,
	Module,
	type ModuleMetadata,
	type Provider,
} from "@nestjs/common";
import type {
	ClassConstructorReturnType,
	ClassDefinition,
} from "./aws-sdk-v3.type.js";
import { getClientToken } from "./aws-sdk-v3.util.js";

interface RegisterOptions<C extends ClassDefinition> {
	isGlobal?: boolean;
	key?: string;
	client: ClassConstructorReturnType<C>;
}

interface RegisterAsyncOptions<C extends ClassDefinition>
	extends Pick<ModuleMetadata, "imports"> {
	isGlobal?: boolean;
	key?: string;
	clientType: C;
	inject?: InjectionToken[];
	useFactory: (
		...args: any[]
	) => ClassConstructorReturnType<C> | Promise<ClassConstructorReturnType<C>>;
}

@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class AwsSdkModule {
	static register<C extends ClassDefinition>(
		options: RegisterOptions<C>,
	): DynamicModule {
		const { client, key = "", isGlobal = false } = options;

		// const className = client.__proto__.constructor.name as string;
		const providerToken = getClientToken(client, key);

		const ClientProvider: Provider = {
			provide: providerToken,
			useValue: client,
		};

		return {
			module: AwsSdkModule,
			providers: [ClientProvider],
			exports: [ClientProvider],
			global: isGlobal,
		};
	}

	static async registerAsync<C extends ClassDefinition>(
		options: RegisterAsyncOptions<C>,
	): Promise<DynamicModule> {
		const {
			useFactory,
			imports = [],
			inject = [],
			isGlobal,
			key = "",
			clientType,
		} = options;

		// const className = clientType.name;
		const providerToken = getClientToken(clientType, key);

		const ClientProvider: Provider = {
			inject,
			provide: providerToken,
			useFactory,
		};

		return {
			imports,
			module: AwsSdkModule,
			providers: [ClientProvider],
			exports: [ClientProvider],
			global: isGlobal,
		};
	}
}
