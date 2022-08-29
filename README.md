# type-to-openapi

TypeScriptの型定義からOpenAPI SchemeのScheme部分を生成するコード.

入力になるAPIの型定義

```typescript:types.ts
export type PingResponse = {
  body: string;
  status: 'ok' | 'ng' | 1;
  nullableParameter?: string;
}

export type CommentResponse = {
  text: string;
}
```

実行

```shell
# input
npm run generate

# output
> type-to-openapi@1.0.0 generate
> npx tsc src/index.ts && node src/index.js

{"components":{"schemes":{"PingResponse":{"title":"PingResponse","required":["body","status"],"type":"object","properties":{"body":{"title":"PingResponse","type":"string"},"status":{"title":"PingResponse","type":["ok","ng",1]},"nullableParameter":{"title":"PingResponse","type":"string"}}},"CommentResponse":{"title":"CommentResponse","required":["text"],"type":"object","properties":{"text":{"title":"CommentResponse","type":"string"}}}}}}
```

出力 + フォーマットしたスキーマファイル

```json:schemes.json
{
  "components": {
    "schemes": {
      "PingResponse": {
        "title": "PingResponse",
        "required": [
          "body",
          "status"
        ],
        "type": "object",
        "properties": {
          "body": {
            "title": "PingResponse",
            "type": "string"
          },
          "status": {
            "title": "PingResponse",
            "type": [
              "ok",
              "ng",
              1
            ]
          },
          "nullableParameter": {
            "title": "PingResponse",
            "type": "string"
          }
        }
      },
      "CommentResponse": {
        "title": "CommentResponse",
        "required": [
          "text"
        ],
        "type": "object",
        "properties": {
          "text": {
            "title": "CommentResponse",
            "type": "string"
          }
        }
      }
    }
  }
}
```

生成したファイルを使って OpenAPI の API 部分とかを作ると楽そう. それも自動化できないかな.

### TODO

- 入力ファイルのパス指定ができない
- 対応していない型がたくさん
- 別で定義した型を参照したときに OpenAPI の Refs で引っ張ってくるようにする
- GitHub の npm パッケージ化して使えるようにしたい
