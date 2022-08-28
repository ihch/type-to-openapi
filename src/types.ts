export type PingResponse = {
  body: string;
  status: 'ok' | 'ng' | 1;
  nullableParameter?: string;
}

export type CommentResponse = {
  text: string;
}
