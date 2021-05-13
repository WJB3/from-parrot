export interface CreatePermissionDto {
  name: string;
  zhName: string;
  target: number;
  parentId: string | number;
  sort: number;
}
