/**
 * state 0:开启 1：关闭
 */
export interface CreateRoleDto {
  id?: number;
  name: string;
  zhName: string;
  state: 0 | 1;
  remarks?: string;
}

export interface UpdateRolePermissionDto {
  ids: any[];
  rootId?: number;
}
