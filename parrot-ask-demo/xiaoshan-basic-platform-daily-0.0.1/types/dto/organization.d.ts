export interface CreateOrganizationDto {
  id?: number;
  name: string;
  parentId: number;
  sort: number;
  type: number;
}

export interface CreateOrganizationLeaderDto {
  teacherId: number;
  departmentId: number;
  position?: string;
  management?:boolean
}
