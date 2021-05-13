import { GroupMember } from 'types/model/group';

export interface CreateGroupDto {
  id?:number;
  name?: string;
  propertyType?: number;
  leaderId?: number;
  leaderType?: number;
  members?: GroupMember[];
}

export interface SearchLessonGroupParams {
  current?: number;
  size?: number;
}
