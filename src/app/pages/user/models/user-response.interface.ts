export interface UserResponse {
  userId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  state: string;
  stateDescription: any;
  auditCreateDate: string;
  icEdit: string;
  icDelete: string;
}

export interface UserByIdResponse {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  state: string;
}
