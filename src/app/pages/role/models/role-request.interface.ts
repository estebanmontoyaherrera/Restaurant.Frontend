export interface RoleCreateRequest {
  name: string;
  description: string;
  state: number;
  permissions: PermissionsRequest[];
  menus: MenusRequest[];
}

export interface RoleUpdateRequest {
  roleId: number;
  name: string;
  description: string;
  state: number;
  permissions: PermissionsRequest[];
  menus: MenusRequest[];
}

export interface PermissionsRequest {
  permissionId: number;
  permissionName: string;
  permissionDescription: string;
}

export interface MenusRequest {
  menuId: number;
}