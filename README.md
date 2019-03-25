# serverless-chrome-aws-lambdas-pdf

This infrastructure uses serverless-chrome to print a pdf file from an url link.

## Infrastructure components:

1. AWS API Gateway
2. 2 Lambdas
3. S3 Bucket with lifecycle set to 1 day for expiration

See `serverless.yml`.

## To Deploy:

- Edit `serverless.yml` and enter your `<account-id>`, `<LAMBDANAME>` and `<BUCKETNAME>`
- Make a `src/handlers/.env` file after `.env_sample` template
- Run `npm run deploy`

## To Test

- Run `npm run test`
- Check `tmp` folder for the link.
