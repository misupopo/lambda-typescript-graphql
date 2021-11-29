# demo
jwtTokenAuthはtokenを発行させるためのdemoアプリです。appsyncCognitoは発行されたjwtTokenを使用して
graphqlのAPIを実行するためのdemoアプリです。

## 設定
config.jsの設定です。事前にcloudformationであてたcognitoの設定や当リポジトリのtemplate.yamlを使用して
あてたappsyncの設定情報を記載してください。

```
const config = {
  awsRegion: 'ap-northeast-1', リージョン
  apiKey: 'xxxxxxxxx', appsyncで発行したapiKey
  userPoolClientId: 'ap-northeast-1_xxxxxxxx', cognitoで作成したユーザープールのクライントID
  clientId: 'xxxxxxxxxxxx', cognitoで作成したクライアントID
  graphqlEndpoint: 'https://xxxxxxxxx.appsync-api.ap-northeast-1.amazonaws.com/graphql', appsyncのエンドポイント
  jwtToken: 'abcdefghijklmnopqrstvwyz', jwtTokenAuthで発行したtoken情報（一度sign inした後にブラウザのコンソールに出力される）
};
```

