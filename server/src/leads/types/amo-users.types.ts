export interface AmoUser {
  id: number;
  name: string;
}

export interface AmoUserResponse {
  _embedded: {
    users: AmoUser[];
  };
}
