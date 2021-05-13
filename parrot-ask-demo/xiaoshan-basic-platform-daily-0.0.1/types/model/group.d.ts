export interface Group {
  id: number;
  leaderId: number;
  leaderName: string;
  leaderType: number;
  name: string;
  phone: string;
  propertyType: number;
  number?: number;
  members?: GroupMember[];
}

export interface LessonGroup {
  subjectId: number;
  sectionType: number;
  enrollmentYear: number;
}

export interface GroupMember {
  groupId: number;
  memberId: number;
  memberType: number;
  name: string;
  parentIds: number[];
  groupIds: number[];
  numbers: number[];
  number: number;
  phone?: string;
}
