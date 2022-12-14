# AWS SDK V3 NestJS

> AWS SDK Javascript V3 dynamic module for NestJS

[![TypeScript](https://img.shields.io/badge/--3178C6?logo=typescript&logoColor=ffffff)](https://www.typescriptlang.org/) [![Npm package version](https://badgen.net/npm/v/aws-sdk-v3-nest)](https://www.npmjs.com/package/aws-sdk-v3-nest)

## Quick Start

Let's build a S3 client and inject it into the nest app.

```
npm install aws-sdk-v3-nest @aws-sdk/client-s3
```

1. Register the module with a S3 Client, in `app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsSdkModule } from 'aws-sdk-v3-nest';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  imports: [
    // register S3 client
    AwsSdkModule.register({
      client: new S3Client({
        region: 'us-west-2',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

2. use the S3 client in `app.controller.ts`

```ts
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectAws } from 'aws-sdk-v3-nest';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    // inject the client
    @InjectAws(S3Client) private readonly s3: S3Client 
  ) {}
  @Get()
  async helloAws() {
    const listCommand = new ListBucketsCommand({});
    const res = await this.s3.send(listCommand);
    return res;
  }
}
```

3. done!

## Register a Client

Register a client in any module, you can use any client you want. As long as it's a [AWS SDK V3 client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html)

```ts
AwsSdkModule.register({
  client: new S3Client({
    region: 'us-west-2',
  }),
});
```


## Async Register

```ts
AwsSdkModule.registerAsync({
  clientType: S3Client,
  useFactory: async () => {
    const s3 = new S3Client({
      region: 'us-west-2',
    });

    try {
      const listCommand = new ListBucketsCommand({});
      const res = await s3.send(listCommand);
      console.log('Connected to S3');
    } catch (e) {
      console.log('Unable to connect to S3', e);
    }

    return s3;
  },
});
```

### Use `@InjectAws(Client)`

Make sure the `Client` is the type you registered in module.
```ts
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectAws } from 'aws-sdk-v3-nest';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectAws(S3Client) private readonly s3: S3Client,
  ) {}
  @Get()
  async helloAws() {
    const listCommand = new ListBucketsCommand({});
    const res = await this.s3.send(listCommand);
    return res;
  }
}
```


## Multiple Injection/Instances

Please use `key` attribute as the identifier for each `Client`

Example: 
1. register the S3 Client with a unique `key `
```ts
AwsSdkModule.register({
  // register the S3 Client with key `US-WEST-2-CLIENT`
  key: 'US-WEST-2-CLIENT',
  client: new S3Client({
    region: 'us-west-2',
  }),
}),
AwsSdkModule.register({
  // register the S3 Client with key `US-EAST-1-CLIENT`
  key: 'US-EAST-1-CLIENT',
  client: new S3Client({
    region: 'us-east-1',
  }),
}),
```

2. refer the S3 client use `@InjectAws(Client, key)`
```ts
@InjectAws(S3Client, "US-WEST-2-CLIENT") private readonly s3west2: S3Client,
@InjectAws(S3Client, "US-EAST-1-CLIENT") private readonly s3east1: S3Client,
```

## Global Module

Set the option `isGlobal: true` to enable it

```ts
AwsSdkModule.register({
  isGlobal: true,
  client: new S3Client({
    region: 'us-west-2',
  }),
});
```

### Credit

Contributor: [@gjuoun](https://github.com/gjuoun)

Inspired by: [nest-aws-sdk](https://www.npmjs.com/package/nest-aws-sdk)
