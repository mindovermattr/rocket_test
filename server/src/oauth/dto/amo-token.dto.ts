export class AmoTokenResponseDto {
  token_type!: 'Bearer';
  expires_in!: number;
  access_token!: string;
  refresh_token!: string;
}
