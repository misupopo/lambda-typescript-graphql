# lambda-typescript-graphql
Lambda（Typescript）+ AppSync + Graphqlのサンプルプロジェクトです。

## デプロイ
現状のLambdaのtypescriptのソースコードをビルドしデプロイする。

```
make build
make package deploy S3_BUCKET="$(s3 buckete name)"
```


