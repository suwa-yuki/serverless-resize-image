# Serverless Resize Image Service using AWS Services

This Application using Serverless Application Model (SAM).

## How To Deploy

### Install node_modules

```bash
$ cd src
$ docker run -it -v "$PWD":/var/task lambci/lambda:build-nodejs10.x /bin/bash
$ npm install
$ exit
```

### A. API Gateway + Lambda Only

### 1. Package

```bash
$ aws cloudformation package \
  --template-file template.yaml \
  --s3-bucket <your bucket> \
  --output-template-file output.yaml \
  --profile <your aws profile>
```

### 2. Deploy

```bash
$ aws cloudformation deploy \
  --template-file output.yaml \
  --stack-name resize-image \
  --parameter-overrides Env=prd \
  --capabilities CAPABILITY_IAM \
  --profile <your aws profile>
```

### B. With Custom Domain

### 1. Package

```bash
$ aws cloudformation package \
  --template-file template-with-domain.yaml \
  --s3-bucket <your bucket> \
  --output-template-file output.yaml \
  --profile <your aws profile>
```

### 2. Deploy

```bash
$ aws cloudformation deploy \
  --template-file output.yaml \
  --stack-name resize-image \
  --parameter-overrides Env=prd CustomDomainName=<your domain name> CertificateArn=<your certificate arn>\
  --capabilities CAPABILITY_IAM \
  --profile <your aws profile>
```

## How To Use

```bash
$ curl \
  -X GET \
  -H 'Accept: image/png' \
  "https://<your api id>.execute-api.<aws region>.amazonaws.com/<stage>/resize?url=https%3A%2F%2Foctodex.github.com%2Fimages%2Flabtocat.png&w=100&h=100" \
  > resized-image.png
```

## License

MIT License.
