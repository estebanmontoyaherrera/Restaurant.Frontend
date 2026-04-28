export interface UserCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  state: number;
}

export interface UserUpdateRequest {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  state: number;
}
