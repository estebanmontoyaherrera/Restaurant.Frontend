export interface UserRoleCreateRequest {
  userId: number;
  roleId: number;
  state: string;
}

export interface UserRoleUpdateRequest {
  userRoleId: number;
  userId: number;
  roleId: number;
  state: string;
}
