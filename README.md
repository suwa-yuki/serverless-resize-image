# Resize Image Service using AWS Services

This Application using Serverless Application Model (SAM).

## How To Deploy

### Package

```bash
$ aws cloudformation package \
  --template-file template.yaml \
  --s3-bucket <your bucket> \
  --output-template-file output.yaml \
  --profile <your aws profile>
```

### Deploy

```bash
$ aws cloudformation deploy \
  --template-file output.yaml \
  --stack-name resize-image \
  --parameter-overrides Env=prd \
  --capabilities CAPABILITY_IAM \
  --profile <your aws profile>
```

## How To Use

TBD

## License

MIT License.
