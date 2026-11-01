export class AmoUserDto {
  id!: number;
  name!: string;
}

export class AmoUserResponseDto {
  _embedded!: {
    users: AmoUserDto[];
  };
}
