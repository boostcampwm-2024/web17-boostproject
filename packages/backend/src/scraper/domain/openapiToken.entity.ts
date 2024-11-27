import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'openapi_token' })
export class OpenapiToken {
  @PrimaryColumn({ name: 'account' })
  account: string;

  @Column({ name: 'apiUrl' })
  api_url: string;

  @Column({ name: 'key' })
  api_key: string;

  @Column({ name: 'password' })
  api_password: string;

  @Column({ name: 'token', length: 512 })
  api_token?: string;

  @Column({ name: 'tokenExpire' })
  api_token_expire?: Date;

  @Column({ name: 'websocketKey' })
  websocket_key?: string;

  @Column({ name: 'websocketKeyExpire' })
  websocket_key_expire?: Date;
}
