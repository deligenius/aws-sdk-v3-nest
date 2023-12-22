

# AWS SDK V3 Nest 


> AWS SDK Javascript V3 dynamic module for NestJS

[![TypeScript](https://img.shields.io/badge/--3178C6?logo=typescript&logoColor=ffffff)](https://www.typescriptlang.org/) 
[![Npm package version](https://badgen.net/npm/v/aws-sdk-v3-nest)](https://www.npmjs.com/package/aws-sdk-v3-nest)
![npm](https://img.shields.io/npm/dw/aws-sdk-v3-nest)
![NPM](https://img.shields.io/npm/l/aws-sdk-v3-nest)
![GitHub Repo stars](https://img.shields.io/github/stars/deligenius/aws-sdk-v3-nest?style=social)


<details>

<summary><h3>Quick Start</h3></summary>


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

</details>

## Installation

* Add `aws-sdk-v3-nest` to your project
  ```bash
   npm install aws-sdk-v3-nest
   ```
* Make sure at least one [AWS SDK for JavaScript V3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html) is in your project. Please skip this step if you already have it installed
  ```bash
  npm install @aws-sdk/client-s3
   ```

## Add Environment Variables

Ensure the following environment variables are present in your project. These variables are critical for authentication and communication with AWS services.

**Security Note:** Treat these keys as sensitive information. Do not commit them to public repositories and ensure they are securely stored and accessed.

**Setting Up:** Typically, these variables are placed in a `.env` file in your project's root directory or configured directly in your deployment platform's environment settings.

```bash
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
```

## Register a Client

You can register any AWS SDK client you want. As long as it's a [AWS SDK V3 client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html)

A good example: [`S3Client`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/)

<img width="324" alt="image" src="https://github.com/deligenius/aws-sdk-v3-nest/assets/8935612/10230c29-0ad3-4bf7-a07d-e0a0e866b166">

```ts
import { S3Client } from '@aws-sdk/client-s3';
import { AwsSdkModule } from 'aws-sdk-v3-nest';

// ... your code ...

AwsSdkModule.register({
  client: new S3Client({
    region: 'us-west-2',
  }),
});
```




## Async Register

The library provides an async `useFactory` that allows you to add more logics before setting up the client instance.

```ts
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import { AwsSdkModule } from 'aws-sdk-v3-nest';

//... your code ...

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

With a registered S3 client, you can now inject the instance to your service and controller.

> Make sure the `Client` is the type you registered in module.

```ts
/** Use S3 client in AppController */
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

To add more instances is easy, just `register` more! 
If you have same type of clients, please use the `key` attribute as the identifier.

Example for multiple S3 client instances

### Register the S3 Client with a unique `key`
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

### Inject and refer clients by `@InjectAws(Client, key)`
```ts
@InjectAws(S3Client, "US-WEST-2-CLIENT") private readonly s3west2: S3Client,
@InjectAws(S3Client, "US-EAST-1-CLIENT") private readonly s3east1: S3Client,
```

## Global Module

By default, a client is only available at where it is registered.
You have an option to make it global, `isGlobal: true`

```ts
AwsSdkModule.register({
  isGlobal: true,
  client: new S3Client({
    region: 'us-west-2',
  }),
});
```

## Get client token

If you need a client key for testing purpose. Please pass the [AWS SDK V3 client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html) and `key` to `getClientToken`

```ts
getClientToken(S3Client, key = "")
```

### Credit

Inspired by: [nest-aws-sdk](https://www.npmjs.com/package/nest-aws-sdk)
